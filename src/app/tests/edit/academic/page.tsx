"use client";
import { useEffect, useState } from "react";
import {
  getTestData,
  TestQuestion,
  TestInterpretation,
  updateTestQuestion,
  updateTestInterpretation,
} from "@/utils/tests/academic";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "react-toastify";

export default function TestEditingPage() {
  const [questions, setQuestions] = useState<TestQuestion[]>([]);
  const [interpretations, setInterpretations] = useState<TestInterpretation[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [mode, setmode] = useState<"questions" | "interpretations">(
    "questions"
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getTestData();
        setQuestions(data.questions);
        setInterpretations(data.interpretations);
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const updatedQuestions = async () => {
    try {
      const response = await updateTestQuestion(questions);
      if (response) {
        toast.success("Questions updated successfully!");
      } else {
        toast.error("Failed to update questions.");
      }
    } catch (error) {
      console.error("Error updating questions:", error);
    }
  };
  const updatedInterpretations = async () => {
    try {
      const response = await updateTestInterpretation(interpretations);
      if (response) {
        toast.success("Interpretations updated successfully!");
      } else {
        toast.error("Failed to update interpretations.");
      }
    } catch (error) {
      console.error("Error updating interpretations:", error);
    }
  };

  const handleQuestionUpdate = (
    index: number,
    field: keyof TestQuestion,
    value: any
  ) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index] = { ...updatedQuestions[index], [field]: value };
    setQuestions(updatedQuestions);
  };

  const handleInterpretationUpdate = (
    index: number,
    field: keyof TestInterpretation,
    value: any
  ) => {
    const updatedInterpretations = [...interpretations];
    updatedInterpretations[index] = {
      ...updatedInterpretations[index],
      [field]: value,
    };
    setInterpretations(updatedInterpretations);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <h1 className="text-3xl font-bold mb-8 text-primary">
        Acadmic Stress Management
      </h1>

      <Tabs defaultValue="questions" className="space-y-6">
        <TabsList className="w-full border-b">
          <TabsTrigger
            onClick={() => {
              setmode("questions");
            }}
            value="questions"
            className="w-1/2"
          >
            Questions
          </TabsTrigger>
          <TabsTrigger
            onClick={() => {
              setmode("interpretations");
            }}
            value="interpretations"
            className="w-1/2"
          >
            Interpretations
          </TabsTrigger>
        </TabsList>

        <TabsContent value="questions">
          <div className="grid gap-6">
            {questions.map((question, index) => (
              <Card
                key={question.id}
                className="p-6 hover:shadow-lg transition-shadow bg-gray-100"
              >
                <div className="flex items-start gap-6">
                  {/* Left side - Read-only info */}
                  <div className="w-24 text-sm text-muted-foreground">
                    <div className="mb-2">
                      <div className="font-medium">Question</div>
                      <div className="text-2xl font-bold">
                        {question.question_number}
                      </div>
                    </div>
                    <div className="mb-2">
                      <div className="font-medium">Dimension </div>
                      <div className="text-sm">{question.dimension}</div>
                    </div>
                    <div>
                      <div className="font-medium">Options</div>
                      <div className="text-sm">Yes / No</div>
                    </div>
                  </div>

                  {/* Right side - Editable content */}
                  <div className="flex-1 space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Question Text
                      </label>
                      <Textarea
                        value={question.question_text}
                        onChange={(e) =>
                          handleQuestionUpdate(
                            index,
                            "question_text",
                            e.target.value
                          )
                        }
                        className="min-h-[100px] text-lg bg-white"
                        placeholder="Enter question text..."
                      />
                    </div>

                    <div className="flex items-center gap-8">
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={question.is_positive}
                          onCheckedChange={(checked) =>
                            handleQuestionUpdate(index, "is_positive", checked)
                          }
                        />
                        <label className="text-sm font-medium">
                          Positive Question
                        </label>
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={question.is_active}
                          onCheckedChange={(checked) =>
                            handleQuestionUpdate(index, "is_active", checked)
                          }
                        />
                        <label className="text-sm font-medium">Active</label>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="interpretations">
          <div className="grid gap-6">
            {interpretations.map((interpretation, index) => (
              <Card
                key={interpretation.id}
                className="p-6 hover:shadow-lg transition-shadow bg-gray-100"
              >
                <div className="space-y-6">
                  {/* Header section */}
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Title
                      </label>
                      <Input
                        value={interpretation.title}
                        onChange={(e) =>
                          handleInterpretationUpdate(
                            index,
                            "title",
                            e.target.value
                          )
                        }
                        className="text-lg font-medium bg-white"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Gender
                      </label>

                      <Select
                        value={interpretation.gender}
                        onValueChange={(value) =>
                          handleInterpretationUpdate(index, "gender", value)
                        }
                      >
                        <SelectTrigger className="w-full bg-white">
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Level Name
                      </label>
                      <Input
                        value={interpretation.level_name}
                        onChange={(e) =>
                          handleInterpretationUpdate(
                            index,
                            "level_name",
                            e.target.value
                          )
                        }
                        className="bg-white"
                      />
                    </div>
                  </div>

                  {/* Score Range */}
                  <div className="bg-muted rounded-lg">
                    <label className="text-sm font-medium mb-3 block">
                      Score Range
                    </label>
                    <div className="grid grid-cols-2 gap-4 max-w-md">
                      <div>
                        <div className="text-xs text-muted-foreground mb-1">
                          Min Score
                        </div>
                        <Input
                          type="number"
                          value={interpretation.min_score}
                          onChange={(e) =>
                            handleInterpretationUpdate(
                              index,
                              "min_score",
                              parseInt(e.target.value)
                            )
                          }
                          className="bg-white"
                        />
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground mb-1">
                          Max Score
                        </div>
                        <Input
                          type="number"
                          value={interpretation.max_score}
                          onChange={(e) =>
                            handleInterpretationUpdate(
                              index,
                              "max_score",
                              parseInt(e.target.value)
                            )
                          }
                          className="bg-white"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Description and Recommendation */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Description
                      </label>
                      <Textarea
                        value={interpretation.description}
                        onChange={(e) =>
                          handleInterpretationUpdate(
                            index,
                            "description",
                            e.target.value
                          )
                        }
                        className="min-h-[150px] bg-white"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Recommendation
                      </label>
                      <Textarea
                        value={interpretation.recommendation}
                        onChange={(e) =>
                          handleInterpretationUpdate(
                            index,
                            "recommendation",
                            e.target.value
                          )
                        }
                        className="min-h-[150px] bg-white"
                      />
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <div className="mt-8 flex justify-end gap-4 sticky bottom-0 bg-background p-4 border-t">
        <Button variant="outline" size="lg">
          Cancel
        </Button>
        <Button
          size="lg"
          className="px-8 text-white"
          onClick={mode === "questions" ? updatedQuestions : updatedInterpretations}
        >
          Save Changes
        </Button>
      </div>
    </div>
  );
}
