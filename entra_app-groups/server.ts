import express, { Request, Response } from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

// Load environmental parameters
dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-loader helper for Gemini client
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is missing in your workspace. You can configure it inside the Secrets panel.");
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// -------------------------------------------------------------
// API ENDPOINTS
// -------------------------------------------------------------

// Basic health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    geminiConfigured: !!process.env.GEMINI_API_KEY
  });
});

// App / Group Audit Endpoint: Analyzes resource configuration and delivers structured insights
app.post('/api/audit', async (req: Request, res: Response) => {
  try {
    const { appRegistrations, securityGroups } = req.body;
    
    // Ensure we have some payload
    if (!appRegistrations || !securityGroups) {
      return res.status(400).json({ error: 'Missing appRegistrations or securityGroups in request body.' });
    }

    const ai = getGeminiClient();

    const prompt = `
You are a Lead Cloud Security Architect specializing in Microsoft Entra ID (formerly Azure Active Directory), IAM, and least-privilege principles.

Analyze the following active tenant resources consisting of App Registrations and Security Groups. Focus on:
1. Over-privileged API permissions (e.g. Directory.ReadWrite.All on daemon apps, delegating too much power).
2. Secret expiry hygiene (checking secrets with long live cycles or already expired keys).
3. SPA applications incorrectly holding or relying on client secrets (high risk).
4. Invalid dynamic membership rule syntax or overly permissive dynamic filters.
5. Nested group loops, lack of dynamic processing or owner assignments.

RESOURCES TO AUDIT:

App Registrations:
${JSON.stringify(appRegistrations, null, 2)}

Security Groups:
${JSON.stringify(securityGroups, null, 2)}

Produce a list of structured audit findings. Return your analysis strictly as a JSON array of objects conforming to this schema (no markdown, just raw JSON array of objects):
[
  {
    "severity": "low" | "medium" | "high" | "critical",
    "category": "Security" | "Architecture" | "Best Practice" | "Compliance",
    "title": "Clear concise summary of the issue",
    "description": "Deep technical explanation of the issue found in the configuration",
    "resourceId": "ID of the specific app registration or group",
    "resourceName": "Name of the resource",
    "resourceType": "AppRegistration" | "SecurityGroup",
    "remediation": "Clear, actionable step-by-step remediation guide or PowerShell/CLI/Terraform command"
  }
]
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              severity: { type: Type.STRING, description: "severity of the threat" },
              category: { type: Type.STRING, description: "type of issue" },
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              resourceId: { type: Type.STRING },
              resourceName: { type: Type.STRING },
              resourceType: { type: Type.STRING },
              remediation: { type: Type.STRING }
            },
            required: ['severity', 'category', 'title', 'description', 'resourceId', 'resourceName', 'resourceType', 'remediation']
          }
        }
      }
    });

    const text = response.text ? response.text.trim() : '[]';
    res.json(JSON.parse(text));
  } catch (err: any) {
    console.error("Gemini Audit Error:", err);
    res.status(500).json({
      error: err.message || "Failed to conduct Gemini security audit.",
      suggestion: "Make sure you have configured a valid GEMINI_API_KEY in Settings."
    });
  }
});

// Code / Automation Generator: Generates beautiful configuration scripts or manifests
app.post('/api/generate-script', async (req: Request, res: Response) => {
  try {
    const { resource, resourceType, scriptType, customInstruction } = req.body;
    
    if (!resource || !resourceType || !scriptType) {
      return res.status(400).json({ error: 'Missing resource, resourceType, or scriptType specification.' });
    }

    const ai = getGeminiClient();

    const prompt = `
You are an expert DevSecOps engineer specializing in Azure automated provisioning and Infrastructure-as-code for Microsoft Entra ID.

Generate high-quality, production-ready code of type "${scriptType}" for the following "${resourceType}" resource:
Resource Details:
${JSON.stringify(resource, null, 2)}

User Custom Instruction / Guidelines:
${customInstruction || "No additional guidelines"}

Supported script types are:
- "terraform": Provide a complete azuread Terraform snippet using the hashicorp/azuread provider (e.g., azuread_application, azuread_application_password, azuread_group). Included nested blocks, api permissions, or rules exactly matching the resource specifications.
- "powershell": Provide modern Microsoft.Graph module PowerShell directives with connect prompts, appropriate scopes and parameterized variables.
- "cli": Provide Azure CLI 'az ad app' / 'az ad group' commands with explicit argument declarations.
- "manifest": Deliver the official, valid Microsoft Graph JSON manifest schema for this object to be imported directly in the Azure App Registration portal.

Format requirements:
- Return your response strictly as a JSON object with two fields (no extra text, strictly JSON):
{
  "code": "Code content string with correct indentation and matching syntax",
  "explanation": "A clean 2-3 sentence description explaining key parameters modeled (e.g. dynamic filters, credentials protection, standard admin scopes)."
}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            code: { type: Type.STRING },
            explanation: { type: Type.STRING }
          },
          required: ['code', 'explanation']
        }
      }
    });

    const text = response.text ? response.text.trim() : '{}';
    res.json(JSON.parse(text));
  } catch (err: any) {
    console.error("Script Generation Failure:", err);
    res.status(500).json({
      error: err.message || "Generation of provisioning script failed.",
      suggestion: "Confirm your Gemini API Key in secrets panel."
    });
  }
});

// Live Entra AD Integration Proxy: Gets Access Token using Client Credentials flow or queries Microsoft Graph API
app.post('/api/graph/call', async (req: Request, res: Response) => {
  try {
    const { tenantId, clientId, clientSecret, apiPath } = req.body;

    if (!tenantId || !clientId || !clientSecret) {
      return res.status(400).json({ error: "Missing tenantCredentials parameters (TenantId, ClientId or ClientSecret)." });
    }

    const path = apiPath || '/v1.0/applications';

    // 1. Authenticate with Azure MSAL endpoints to acquire Graph access_token
    const tokenUrl = `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`;
    
    const params = new URLSearchParams();
    params.append('client_id', clientId);
    params.append('scope', 'https://graph.microsoft.com/.default');
    params.append('client_secret', clientSecret);
    params.append('grant_type', 'client_credentials');

    const tokenRes = await fetch(tokenUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params
    });

    if (!tokenRes.ok) {
      const tokenError = await tokenRes.json().catch(() => ({}));
      return res.status(401).json({
        error: "Entra Connection Failed (Authentication failure).",
        details: tokenError.error_description || "Invalid credentials, secret might be expired or tenant incorrect."
      });
    }

    const tokenData = await tokenRes.json() as { access_token: string };
    const accessToken = tokenData.access_token;

    // 2. Execute requested call against Microsoft Graph API
    const targetUrl = `https://graph.microsoft.com${path}`;
    const graphRes = await fetch(targetUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json'
      }
    });

    const graphData = await graphRes.json();

    if (!graphRes.ok) {
      return res.status(graphRes.status).json({
        error: `Microsoft Graph returned an HTTP ${graphRes.status} Error`,
        details: graphData.error?.message || "Verify permissions in your app registration on portal.azure.com (requires Application permissions e.g., Application.Read.All or Group.Read.All)."
      });
    }

    res.json({
      status: "success",
      path: path,
      data: graphData
    });

  } catch (err: any) {
    console.error("Graph proxy validation error:", err);
    res.status(500).json({
      error: "Unable to establish Microsoft Entra connection.",
      details: err.message || "Network exception. Verify the credentials are accurate."
    });
  }
});

// -------------------------------------------------------------
// VITE OR STATIC STATIC SERVING MIDDLEWARE
// -------------------------------------------------------------
async function bootstrap() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Microsoft Entra Management Hub] Service listening on port ${PORT}`);
  });
}

bootstrap();
