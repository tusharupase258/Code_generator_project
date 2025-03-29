import React, { useState } from 'react';
import {
  Bot,
  Box,
  Check,
  Cloud,
  Code2,
  Copy,
  FileCode2,
  GitBranch,
  History,
  Lock,
  PlayCircle,
  Settings,
  Shield,
  Terminal,
  X,
} from 'lucide-react';

interface GeneratedCode {
  id: string;
  type: 'terraform' | 'bicep' | 'helm';
  description: string;
  timestamp: string;
  status: 'generating' | 'validated' | 'deployed';
  code?: string;
}

function App() {
  const [prompt, setPrompt] = useState('');
  const [selectedProvider, setSelectedProvider] = useState('terraform');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showCopiedToast, setShowCopiedToast] = useState(false);
  const [generatedCodes, setGeneratedCodes] = useState<GeneratedCode[]>([
    {
      id: '1',
      type: 'terraform',
      description: 'AKS cluster with autoscaling and PostgreSQL',
      timestamp: '2 minutes ago',
      status: 'deployed',
      code: `resource "azurerm_kubernetes_cluster" "main" {
  name                = "production-aks"
  location            = "eastus"
  resource_group_name = azurerm_resource_group.main.name
  dns_prefix         = "prod-aks"

  default_node_pool {
    name       = "default"
    node_count = 3
    vm_size    = "Standard_DS2_v2"
    enable_auto_scaling = true
    min_count   = 1
    max_count   = 5
  }

  identity {
    type = "SystemAssigned"
  }
}`
    },
    {
      id: '2',
      type: 'bicep',
      description: 'Load balanced VM infrastructure',
      timestamp: '10 minutes ago',
      status: 'validated',
      code: `resource loadBalancer 'Microsoft.Network/loadBalancers@2021-02-01' = {
  name: 'app-lb'
  location: location
  sku: {
    name: 'Standard'
  }
  properties: {
    frontendIPConfigurations: [
      {
        name: 'frontend-ip'
        properties: {
          publicIPAddress: {
            id: publicIP.id
          }
        }
      }
    ]
  }
}`
    },
    {
      id: '3',
      type: 'helm',
      description: 'Microservices deployment configuration',
      timestamp: 'Just now',
      status: 'generating',
      code: `apiVersion: v1
kind: Service
metadata:
  name: frontend-service
spec:
  selector:
    app: frontend
  ports:
    - protocol: TCP
      port: 80
      targetPort: 3000
  type: LoadBalancer`
    },
  ]);

  const handleGenerateCode = async () => {
    if (!prompt.trim()) {
      return;
    }

    setIsGenerating(true);

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    const newCode: GeneratedCode = {
      id: Date.now().toString(),
      type: selectedProvider as 'terraform' | 'bicep' | 'helm',
      description: prompt,
      timestamp: 'Just now',
      status: 'generating',
      code: generateSampleCode(selectedProvider, prompt),
    };

    setGeneratedCodes(prev => [newCode, ...prev]);
    setPrompt('');
    
    // Simulate validation process
    setTimeout(() => {
      setGeneratedCodes(prev => 
        prev.map(code => 
          code.id === newCode.id 
            ? { ...code, status: 'validated' } 
            : code
        )
      );
    }, 3000);

    setIsGenerating(false);
  };

  const generateSampleCode = (provider: string, description: string): string => {
    switch (provider) {
      case 'terraform':
        return `resource "azurerm_resource_group" "main" {
  name     = "generated-resources"
  location = "eastus"
}

# Generated based on: ${description}
resource "azurerm_virtual_network" "main" {
  name                = "main-network"
  resource_group_name = azurerm_resource_group.main.name
  location            = azurerm_resource_group.main.location
  address_space       = ["10.0.0.0/16"]
}`;
      case 'bicep':
        return `param location string = resourceGroup().location
param environmentName string

// Generated based on: ${description}
resource vnet 'Microsoft.Network/virtualNetworks@2021-02-01' = {
  name: '\${environmentName}-vnet'
  location: location
  properties: {
    addressSpace: {
      addressPrefixes: [
        '10.0.0.0/16'
      ]
    }
  }
}`;
      case 'helm':
        return `apiVersion: apps/v1
kind: Deployment
metadata:
  name: generated-app
  labels:
    app: generated-app
spec:
  replicas: 3
  selector:
    matchLabels:
      app: generated-app
  template:
    metadata:
      labels:
        app: generated-app
    spec:
      containers:
      - name: main
        image: nginx:latest
        ports:
        - containerPort: 80`;
      default:
        return '';
    }
  };

  const handleCopyCode = async (code: string) => {
    await navigator.clipboard.writeText(code);
    setShowCopiedToast(true);
    setTimeout(() => setShowCopiedToast(false), 2000);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'generating':
        return <Terminal className="w-5 h-5 text-blue-500 animate-pulse" />;
      case 'validated':
        return <Shield className="w-5 h-5 text-yellow-500" />;
      case 'deployed':
        return <Check className="w-5 h-5 text-green-500" />;
      default:
        return null;
    }
  };

  const getProviderIcon = (type: string) => {
    switch (type) {
      case 'terraform':
        return <Cloud className="w-5 h-5 text-purple-500" />;
      case 'bicep':
        return <Box className="w-5 h-5 text-blue-500" />;
      case 'helm':
        return <GitBranch className="w-5 h-5 text-green-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Copied Toast */}
      {showCopiedToast && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center">
          <Check className="w-4 h-4 mr-2" />
          Code copied to clipboard!
        </div>
      )}

      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Bot className="w-8 h-8 text-indigo-600" />
              <h1 className="ml-3 text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                IaCBuildbot
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <button className="flex items-center px-4 py-2 text-sm font-medium text-slate-700 hover:text-slate-900">
                <History className="w-4 h-4 mr-2" />
                History
              </button>
              <button className="flex items-center px-4 py-2 text-sm font-medium text-slate-700 hover:text-slate-900">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Input Section */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-8">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-slate-900 mb-2">
              Build Your Infrastructure
            </h2>
            <p className="text-slate-600">
              Describe your infrastructure needs, and let IaCBuildBot generate the code.
            </p>
          </div>
          
          <div className="space-y-4">
            <div>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Example: Create an AKS cluster with 3 nodes, autoscaling enabled, and a managed PostgreSQL database..."
                className="w-full h-32 px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            
            <div className="flex items-center space-x-4">
              <select
                value={selectedProvider}
                onChange={(e) => setSelectedProvider(e.target.value)}
                className="px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="terraform">Terraform</option>
                <option value="bicep">Azure Bicep</option>
                <option value="helm">Helm Chart</option>
              </select>
              
              <button
                onClick={handleGenerateCode}
                disabled={isGenerating || !prompt.trim()}
                className={`flex items-center px-6 py-2 rounded-lg focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                  isGenerating || !prompt.trim()
                    ? 'bg-indigo-400 cursor-not-allowed'
                    : 'bg-indigo-600 hover:bg-indigo-700'
                } text-white`}
              >
                {isGenerating ? (
                  <Terminal className="w-5 h-5 mr-2 animate-spin" />
                ) : (
                  <PlayCircle className="w-5 h-5 mr-2" />
                )}
                {isGenerating ? 'Building...' : 'Build Infrastructure'}
              </button>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 border border-slate-200">
            <div className="flex items-center mb-4">
              <div className="bg-indigo-100 rounded-full p-3">
                <FileCode2 className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="ml-3 font-semibold text-slate-900">AI-Powered IaC</h3>
            </div>
            <p className="text-slate-600">
              Build infrastructure code instantly using natural language descriptions.
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-slate-200">
            <div className="flex items-center mb-4">
              <div className="bg-green-100 rounded-full p-3">
                <Shield className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="ml-3 font-semibold text-slate-900">Security First</h3>
            </div>
            <p className="text-slate-600">
              Automated security checks and compliance with Azure best practices.
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-slate-200">
            <div className="flex items-center mb-4">
              <div className="bg-purple-100 rounded-full p-3">
                <Code2 className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="ml-3 font-semibold text-slate-900">DevOps Ready</h3>
            </div>
            <p className="text-slate-600">
              Seamless integration with your existing CI/CD pipelines.
            </p>
          </div>
        </div>

        {/* Recent Generations */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200">
          <div className="px-6 py-4 border-b border-slate-200">
            <h2 className="text-lg font-semibold text-slate-900">Recent Builds</h2>
          </div>
          <div className="divide-y divide-slate-200">
            {generatedCodes.map((code) => (
              <div key={code.id} className="px-6 py-4 hover:bg-slate-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {getProviderIcon(code.type)}
                    <div>
                      <h3 className="text-sm font-medium text-slate-900">
                        {code.description}
                      </h3>
                      <p className="text-sm text-slate-500">
                        Built {code.timestamp}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <button 
                      onClick={() => code.code && handleCopyCode(code.code)}
                      className="p-2 text-slate-400 hover:text-slate-600"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    {getStatusIcon(code.status)}
                    <span className="text-sm capitalize text-slate-700">
                      {code.status}
                    </span>
                  </div>
                </div>
                {code.code && (
                  <div className="mt-4">
                    <pre className="bg-slate-800 rounded-lg p-4 overflow-x-auto">
                      <code className="text-sm text-slate-100">{code.code}</code>
                    </pre>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;