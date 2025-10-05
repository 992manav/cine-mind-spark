import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Activity, 
  BarChart3, 
  Database, 
  PlayCircle, 
  Settings, 
  TrendingUp, 
  Users,
  Zap,
  AlertCircle,
  CheckCircle,
  Clock
} from "lucide-react";

const Admin = () => {
  const [loadProgress, setLoadProgress] = useState(0);
  const [isTestRunning, setIsTestRunning] = useState(false);

  const startLoadTest = () => {
    setIsTestRunning(true);
    setLoadProgress(0);
    
    const interval = setInterval(() => {
      setLoadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsTestRunning(false);
          return 100;
        }
        return prev + 10;
      });
    }, 500);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="pt-20 px-4 sm:px-6 lg:px-8 pb-12">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-background" />
              </div>
              <div>
                <h1 className="text-4xl font-bold">Admin Dashboard</h1>
                <p className="text-muted-foreground">Scalability & Reliability Analysis Platform</p>
              </div>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="glass-effect border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Activity className="w-4 h-4 text-primary" />
                  System Load
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">45%</div>
                <p className="text-xs text-muted-foreground mt-1">Normal operation</p>
              </CardContent>
            </Card>

            <Card className="glass-effect border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Users className="w-4 h-4 text-secondary" />
                  Active Users
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">2,847</div>
                <p className="text-xs text-muted-foreground mt-1">+12% from last hour</p>
              </CardContent>
            </Card>

            <Card className="glass-effect border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Zap className="w-4 h-4 text-accent" />
                  Avg Response
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">124ms</div>
                <p className="text-xs text-muted-foreground mt-1">Excellent performance</p>
              </CardContent>
            </Card>

            <Card className="glass-effect border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Uptime
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">99.8%</div>
                <p className="text-xs text-muted-foreground mt-1">Last 30 days</p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Tabs */}
          <Tabs defaultValue="testing" className="space-y-6">
            <TabsList className="glass-effect border-border/50">
              <TabsTrigger value="testing">Load Testing</TabsTrigger>
              <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
              <TabsTrigger value="algorithms">Algorithms</TabsTrigger>
              <TabsTrigger value="datasets">Datasets</TabsTrigger>
            </TabsList>

            {/* Load Testing Tab */}
            <TabsContent value="testing" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Test Configuration */}
                <Card className="glass-effect border-border/50">
                  <CardHeader>
                    <CardTitle>Test Configuration</CardTitle>
                    <CardDescription>Configure load testing parameters</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Test Type</Label>
                      <Select defaultValue="load">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="load">Load Test</SelectItem>
                          <SelectItem value="stress">Stress Test</SelectItem>
                          <SelectItem value="spike">Spike Test</SelectItem>
                          <SelectItem value="endurance">Endurance Test</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Algorithm</Label>
                      <Select defaultValue="collaborative">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="collaborative">Collaborative Filtering</SelectItem>
                          <SelectItem value="content">Content-Based</SelectItem>
                          <SelectItem value="hybrid">Hybrid AI</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Virtual Users</Label>
                      <Input type="number" placeholder="1000" defaultValue="1000" />
                    </div>

                    <div className="space-y-2">
                      <Label>Duration (seconds)</Label>
                      <Input type="number" placeholder="300" defaultValue="300" />
                    </div>

                    <Button 
                      className="w-full bg-primary hover:bg-primary/90"
                      onClick={startLoadTest}
                      disabled={isTestRunning}
                    >
                      <PlayCircle className="w-4 h-4 mr-2" />
                      {isTestRunning ? "Test Running..." : "Start Test"}
                    </Button>
                  </CardContent>
                </Card>

                {/* Test Results */}
                <Card className="glass-effect border-border/50">
                  <CardHeader>
                    <CardTitle>Current Test Status</CardTitle>
                    <CardDescription>Real-time test execution monitoring</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {isTestRunning || loadProgress > 0 ? (
                      <>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Progress</span>
                            <span>{loadProgress}%</span>
                          </div>
                          <Progress value={loadProgress} className="h-2" />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">Requests/sec</p>
                            <p className="text-2xl font-bold">845</p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">Latency</p>
                            <p className="text-2xl font-bold">156ms</p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">Success Rate</p>
                            <p className="text-2xl font-bold">99.2%</p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">Errors</p>
                            <p className="text-2xl font-bold">12</p>
                          </div>
                        </div>

                        <Badge variant="default" className="bg-secondary">
                          <Clock className="w-3 h-3 mr-1" />
                          Test in progress
                        </Badge>
                      </>
                    ) : (
                      <div className="text-center py-12">
                        <PlayCircle className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                        <p className="text-muted-foreground">No active test</p>
                        <p className="text-sm text-muted-foreground mt-2">
                          Configure and start a test to see real-time metrics
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Recent Tests */}
              <Card className="glass-effect border-border/50">
                <CardHeader>
                  <CardTitle>Recent Test Results</CardTitle>
                  <CardDescription>Historical test execution data</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { name: "Load Test #47", status: "success", users: 5000, duration: "5m", avgLatency: "142ms" },
                      { name: "Stress Test #12", status: "success", users: 10000, duration: "10m", avgLatency: "287ms" },
                      { name: "Spike Test #8", status: "warning", users: 15000, duration: "3m", avgLatency: "456ms" }
                    ].map((test, i) => (
                      <div key={i} className="flex items-center justify-between p-4 glass-dark rounded-lg">
                        <div className="flex items-center gap-4">
                          {test.status === "success" ? (
                            <CheckCircle className="w-5 h-5 text-green-500" />
                          ) : (
                            <AlertCircle className="w-5 h-5 text-yellow-500" />
                          )}
                          <div>
                            <p className="font-medium">{test.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {test.users.toLocaleString()} users • {test.duration} • Avg: {test.avgLatency}
                            </p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">View Report</Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Monitoring Tab */}
            <TabsContent value="monitoring" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="glass-effect border-border/50">
                  <CardHeader>
                    <CardTitle>Performance Metrics</CardTitle>
                    <CardDescription>Real-time system performance</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm">CPU Usage</span>
                          <span className="text-sm font-medium">42%</span>
                        </div>
                        <Progress value={42} />
                      </div>
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm">Memory Usage</span>
                          <span className="text-sm font-medium">67%</span>
                        </div>
                        <Progress value={67} />
                      </div>
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm">Network I/O</span>
                          <span className="text-sm font-medium">28%</span>
                        </div>
                        <Progress value={28} />
                      </div>
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm">Database Load</span>
                          <span className="text-sm font-medium">55%</span>
                        </div>
                        <Progress value={55} />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="glass-effect border-border/50">
                  <CardHeader>
                    <CardTitle>Accuracy Metrics</CardTitle>
                    <CardDescription>Recommendation quality indicators</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">RMSE</span>
                        <span className="text-lg font-bold">0.87</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">MAE</span>
                        <span className="text-lg font-bold">0.65</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Precision@10</span>
                        <span className="text-lg font-bold">0.92</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">NDCG</span>
                        <span className="text-lg font-bold">0.88</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Algorithms Tab */}
            <TabsContent value="algorithms" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { name: "Collaborative Filtering", status: "active", accuracy: 0.92, latency: "124ms" },
                  { name: "Content-Based", status: "active", accuracy: 0.88, latency: "98ms" },
                  { name: "Hybrid AI", status: "active", accuracy: 0.95, latency: "156ms" }
                ].map((algo, i) => (
                  <Card key={i} className="glass-effect border-border/50">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{algo.name}</CardTitle>
                        <Badge variant="default" className="bg-green-500">{algo.status}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm">Accuracy</span>
                          <span className="text-sm font-medium">{(algo.accuracy * 100).toFixed(0)}%</span>
                        </div>
                        <Progress value={algo.accuracy * 100} />
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Avg Latency</span>
                        <span className="font-medium">{algo.latency}</span>
                      </div>
                      <Button variant="outline" className="w-full">Configure</Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Datasets Tab */}
            <TabsContent value="datasets" className="space-y-6">
              <Card className="glass-effect border-border/50">
                <CardHeader>
                  <CardTitle>Dataset Management</CardTitle>
                  <CardDescription>Manage training and testing datasets</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { name: "MovieLens 1M", size: "24 MB", records: "1,000,000", status: "active" },
                      { name: "Netflix Prize", size: "2.1 GB", records: "100,480,507", status: "active" },
                      { name: "IMDb Dataset", size: "156 MB", records: "8,547,234", status: "processing" }
                    ].map((dataset, i) => (
                      <div key={i} className="flex items-center justify-between p-4 glass-dark rounded-lg">
                        <div className="flex items-center gap-4">
                          <Database className="w-5 h-5 text-secondary" />
                          <div>
                            <p className="font-medium">{dataset.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {dataset.size} • {dataset.records} records
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={dataset.status === "active" ? "default" : "secondary"}>
                            {dataset.status}
                          </Badge>
                          <Button variant="ghost" size="sm">
                            <Settings className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Admin;
