"use client";
import axios from 'axios';
import { useEffect, useState } from "react";
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

const base_url = process.env.NEXT_PUBLIC_BASE_URL;

type Question = {
    id: number;
    test_id: number;
    question_number: number;
    question_text: string;
    subscale: string;
    is_active?: boolean;
}

type Interpretation = {
    id: number;
    test_slug: string;
    subscale: string;
    score_min: number;
    score_max: number;
    grade: string;
    level_text: string;
    description: string;
    recommendations: string;
    sessions_required: string;
}

const getQuestions = async () => {
    try {
        const response = await axios.get(`${base_url}/edits/adss/get_questions.php`);
        return response.data as Question[];
    } catch (error) {
        console.error("Error fetching questions:", error);
        throw error;
    }
}

const getInterpretations = async () => {
    try {
        const response = await axios.get(`${base_url}/edits/adss/get_interpretations.php`);
        return response.data as Interpretation[];
    } catch (error) {
        console.error("Error fetching interpretations:", error);
        throw error;
    }
}

const getTestData = async () => {
    try {
        const questions = await getQuestions();
        const interpretations = await getInterpretations();
        return { questions, interpretations };
    } catch (error) {
        console.error("Error fetching test data:", error);
        throw error;
    }
}

const updateQuestions = async (questions: Question[]) => {
    try {
        const response = await axios.post(`${base_url}/edits/adss/set_questions.php`, questions);
        return response.data;
    } catch (error) {
        console.error("Error updating questions:", error);
        throw error;
    }
}

const updateInterpretations = async (interpretations: Interpretation[]) => {
    try {
        const response = await axios.post(`${base_url}/edits/adss/set_interpretations.php`, interpretations);
        return response.data;
    } catch (error) {
        console.error("Error updating interpretations:", error);
        throw error;
    }
}

export default function ADSSEditingPage() {
    const [questions, setQuestions] = useState<Question[]>([]);
    const [interpretations, setInterpretations] = useState<Interpretation[]>([]);
    const [loading, setLoading] = useState(true);
    const [mode, setMode] = useState<"questions" | "interpretations">("questions");

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

    const handleSaveQuestions = async () => {
        try {
            const response = await updateQuestions(questions);
            if (response) {
                toast.success("Questions updated successfully!");
            } else {
                toast.error("Failed to update questions.");
            }
        } catch (error) {
            console.error("Error updating questions:", error);
            toast.error("An error occurred while updating questions.");
        }
    };

    const handleSaveInterpretations = async () => {
        try {
            const response = await updateInterpretations(interpretations);
            if (response) {
                toast.success("Interpretations updated successfully!");
            } else {
                toast.error("Failed to update interpretations.");
            }
        } catch (error) {
            console.error("Error updating interpretations:", error);
            toast.error("An error occurred while updating interpretations.");
        }
    };

    const handleQuestionUpdate = (
        index: number,
        field: keyof Question,
        value: any
    ) => {
        const updatedQuestions = [...questions];
        updatedQuestions[index] = { ...updatedQuestions[index], [field]: value };
        setQuestions(updatedQuestions);
    };

    const handleInterpretationUpdate = (
        index: number,
        field: keyof Interpretation,
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
                ADSS Test Management
            </h1>

            <Tabs defaultValue="questions" className="space-y-6">
                <TabsList className="w-full border-b">
                    <TabsTrigger
                        onClick={() => {
                            setMode("questions");
                        }}
                        value="questions"
                        className="w-1/2"
                    >
                        Questions
                    </TabsTrigger>
                    <TabsTrigger
                        onClick={() => {
                            setMode("interpretations");
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
                                            <div className="font-medium">Subscale</div>
                                            <div className="text-sm">{question.subscale}</div>
                                        </div>
                                        <div className="mb-2">
                                            <div className="font-medium">Type</div>
                                            <div className="text-sm">Yes/No</div>
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
                                                    checked={question.is_active === undefined ? true : question.is_active}
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
                                                Grade
                                            </label>
                                            <Input
                                                value={interpretation.grade}
                                                onChange={(e) =>
                                                    handleInterpretationUpdate(
                                                        index,
                                                        "grade",
                                                        e.target.value
                                                    )
                                                }
                                                className="text-lg font-medium bg-white"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium mb-2 block">
                                                Level Text
                                            </label>
                                            <Input
                                                value={interpretation.level_text}
                                                onChange={(e) =>
                                                    handleInterpretationUpdate(
                                                        index,
                                                        "level_text",
                                                        e.target.value
                                                    )
                                                }
                                                className="bg-white"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium mb-2 block">
                                                Subscale
                                            </label>
                                            <Input
                                                value={interpretation.subscale}
                                                onChange={(e) =>
                                                    handleInterpretationUpdate(
                                                        index,
                                                        "subscale",
                                                        e.target.value
                                                    )
                                                }
                                                className="bg-white"
                                                disabled
                                            />
                                        </div>
                                    </div>

                                    {/* Score Range */}
                                    <div className="bg-muted p-4 rounded-lg">
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
                                                    value={interpretation.score_min}
                                                    onChange={(e) =>
                                                        handleInterpretationUpdate(
                                                            index,
                                                            "score_min",
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
                                                    value={interpretation.score_max}
                                                    onChange={(e) =>
                                                        handleInterpretationUpdate(
                                                            index,
                                                            "score_max",
                                                            parseInt(e.target.value)
                                                        )
                                                    }
                                                    className="bg-white"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Sessions Required */}
                                    <div>
                                        <label className="text-sm font-medium mb-2 block">
                                            Sessions Required
                                        </label>
                                        <Input
                                            value={interpretation.sessions_required}
                                            onChange={(e) =>
                                                handleInterpretationUpdate(
                                                    index,
                                                    "sessions_required",
                                                    e.target.value
                                                )
                                            }
                                            className="bg-white"
                                        />
                                    </div>

                                    {/* Description and Recommendations */}
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
                                                Recommendations
                                            </label>
                                            <Textarea
                                                value={interpretation.recommendations}
                                                onChange={(e) =>
                                                    handleInterpretationUpdate(
                                                        index,
                                                        "recommendations",
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
                    onClick={mode === "questions" ? handleSaveQuestions : handleSaveInterpretations}
                >
                    Save Changes
                </Button>
            </div>
        </div>
    );
}
