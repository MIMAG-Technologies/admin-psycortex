"use client";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "react-toastify";
import { ConfirmationModal } from "@/components/ui/confirmation-modal";
import axios from 'axios';

const base_url = process.env.NEXT_PUBLIC_BASE_URL;

type Question = {
    id: number;
    test_id: number;
    question_number: number;
    question_text: string;
    part: number;
    is_active?: boolean;
    created_at?: string;
}

type Interpretation = {
    id: number;
    grade: string;
    level: string;
    description: string;
    behavioral_indicators: string;
    recommendations: string;
    sessions: string;
    created_at?: string;
}

const SCS_OPTIONS = ["Always", "Undecided", "Never"];

// Scoring patterns based on the question number
const getQuestionScores = (questionNumber: number) => {
    // Questions with Always=2, Undecided=1, Never=0 scoring pattern
    const positiveScoreQuestions = [1, 2, 3, 5, 7, 8, 10, 22, 25, 27, 28];

    if (positiveScoreQuestions.includes(questionNumber)) {
        return [2, 1, 0];
    } else {
        // All other questions use Always=0, Undecided=1, Never=2 scoring pattern
        return [0, 1, 2];
    }
};

const getQuestions = async () => {
    try {
        const response = await axios.get(`${base_url}/edits/scs/get_questions.php`);
        return response.data as Question[];
    } catch (error) {
        console.error("Error fetching questions:", error);
        throw error;
    }
}

const getInterpretations = async () => {
    try {
        const response = await axios.get(`${base_url}/edits/scs/get_interpretations.php`);
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
        const response = await axios.post(`${base_url}/edits/scs/set_questions.php`, questions);
        return response.data;
    } catch (error) {
        console.error("Error updating questions:", error);
        throw error;
    }
}

const updateInterpretations = async (interpretations: Interpretation[]) => {
    try {
        const response = await axios.post(`${base_url}/edits/scs/set_interpretations.php`, interpretations);
        return response.data;
    } catch (error) {
        console.error("Error updating interpretations:", error);
        throw error;
    }
}

export default function ScsEditPage() {
    const [questions, setQuestions] = useState<Question[]>([]);
    const [interpretations, setInterpretations] = useState<Interpretation[]>([]);
    const [loading, setLoading] = useState(true);
    const [mode, setMode] = useState<"questions" | "interpretations">("questions");
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

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

    const handleUpdateConfirmation = () => {
        if (mode === "questions") {
            handleSaveQuestions();
        } else {
            handleSaveInterpretations();
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
                Self-Concept Scale (SCS) Test Management
            </h1>

            {/* Confirmation Modal */}
            <ConfirmationModal
                isOpen={isConfirmModalOpen}
                onClose={() => setIsConfirmModalOpen(false)}
                onConfirm={handleUpdateConfirmation}
                title="Confirm Changes"
                description=""
                testName="SCS Test"
                entityType={mode === "questions" ? "Questions" : "Interpretations"}
            />

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
                                            <div className="font-medium">Part</div>
                                            <div className="text-lg font-medium">
                                                {question.part}
                                            </div>
                                        </div>
                                        <div className="mb-2">
                                            <div className="font-medium">Type</div>
                                            <div className="text-sm">Always / Undecided / Never</div>
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

                                        <div className="space-y-2 mt-4">
                                            <div className="flex justify-between items-center">
                                                <label className="text-sm font-medium block">
                                                    Response Options (View Only)
                                                </label>
                                                <div className="text-xs text-muted-foreground">
                                                    {question.question_number <= 30
                                                        ? "Scoring varies by question"
                                                        : "Scoring pattern undefined"}
                                                </div>
                                            </div>
                                            {SCS_OPTIONS.map((option, optionIndex) => {
                                                const scores = getQuestionScores(question.question_number);
                                                return (
                                                    <div key={optionIndex} className="flex gap-2 items-start">
                                                        <div className="bg-muted-foreground text-white font-medium rounded-full w-8 h-8 flex items-center justify-center shrink-0 text-xs">
                                                            {scores[optionIndex]}
                                                        </div>
                                                        <div className="border p-3 rounded-md bg-white flex-1 text-muted-foreground">
                                                            {option}
                                                        </div>
                                                    </div>
                                                );
                                            })}
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
                                                className="bg-white"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium mb-2 block">
                                                Level
                                            </label>
                                            <Input
                                                value={interpretation.level}
                                                onChange={(e) =>
                                                    handleInterpretationUpdate(
                                                        index,
                                                        "level",
                                                        e.target.value
                                                    )
                                                }
                                                className="bg-white"
                                            />
                                        </div>
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
                                                Behavioral Indicators
                                            </label>
                                            <Textarea
                                                value={interpretation.behavioral_indicators}
                                                onChange={(e) =>
                                                    handleInterpretationUpdate(
                                                        index,
                                                        "behavioral_indicators",
                                                        e.target.value
                                                    )
                                                }
                                                className="min-h-[150px] bg-white"
                                            />
                                        </div>
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

                                    <div>
                                        <label className="text-sm font-medium mb-2 block">
                                            Sessions
                                        </label>
                                        <Input
                                            value={interpretation.sessions}
                                            onChange={(e) =>
                                                handleInterpretationUpdate(
                                                    index,
                                                    "sessions",
                                                    e.target.value
                                                )
                                            }
                                            className="bg-white"
                                        />
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
                    onClick={() => setIsConfirmModalOpen(true)}
                >
                    Save Changes
                </Button>
            </div>
        </div>
    );
}
