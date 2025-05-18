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
    dimension: string;
    nature: "positive" | "negative";
    is_active?: boolean;
    created_at?: string;
}

type Interpretation = {
    id: number;
    test_slug: string;
    score_min: number;
    score_max: number;
    grade: string;
    level_text: string;
    description: string;
    recommendations: string;
    sessions_required: string;
    created_at?: string;
}

const WBS_OPTIONS = ["Strongly Disagree", "Disagree", "Undecided", "Agree", "Strongly Agree"];
const POSITIVE_SCORES = [1, 2, 3, 4, 5];
const NEGATIVE_SCORES = [5, 4, 3, 2, 1];

const getQuestions = async () => {
    try {
        const response = await axios.get(`${base_url}/edits/wbs/get_questions.php`);
        return response.data as Question[];
    } catch (error) {
        console.error("Error fetching questions:", error);
        throw error;
    }
}

const getInterpretations = async () => {
    try {
        const response = await axios.get(`${base_url}/edits/wbs/get_interpretations.php`);
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
        const response = await axios.post(`${base_url}/edits/wbs/set_questions.php`, questions);
        return response.data;
    } catch (error) {
        console.error("Error updating questions:", error);
        throw error;
    }
}

const updateInterpretations = async (interpretations: Interpretation[]) => {
    try {
        const response = await axios.post(`${base_url}/edits/wbs/set_interpretations.php`, interpretations);
        return response.data;
    } catch (error) {
        console.error("Error updating interpretations:", error);
        throw error;
    }
}

export default function WbsEditPage() {
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
                Well-Being Scale (WBS) Test Management
            </h1>

            {/* Confirmation Modal */}
            <ConfirmationModal
                isOpen={isConfirmModalOpen}
                onClose={() => setIsConfirmModalOpen(false)}
                onConfirm={handleUpdateConfirmation}
                title="Confirm Changes"
                description=""
                testName="WBS Test"
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
                                    <div className="w-28 text-sm text-muted-foreground">
                                        <div className="mb-2">
                                            <div className="font-medium">Question</div>
                                            <div className="text-2xl font-bold">
                                                {question.question_number}
                                            </div>
                                        </div>
                                        <div className="mb-2">
                                            <div className="font-medium">Dimension</div>
                                            <div className="text-sm">
                                                {question.dimension}
                                            </div>
                                        </div>
                                        <div className="mb-2">
                                            <div className="font-medium">Nature</div>
                                            <div className="text-sm capitalize">
                                                {question.nature}
                                            </div>
                                        </div>
                                        <div className="mb-2">
                                            <div className="font-medium">Scale</div>
                                            <div className="text-sm">5-point Likert</div>
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
                                                    {question.nature === "positive"
                                                        ? "Positive Question: Higher score = better well-being"
                                                        : "Negative Question: Lower score = better well-being"}
                                                </div>
                                            </div>
                                            {WBS_OPTIONS.map((option, optionIndex) => (
                                                <div key={optionIndex} className="flex gap-2 items-start">
                                                    <div className="bg-muted-foreground text-white font-medium rounded-full w-8 h-8 flex items-center justify-center shrink-0 text-xs">
                                                        {question.nature === "positive"
                                                            ? POSITIVE_SCORES[optionIndex]
                                                            : NEGATIVE_SCORES[optionIndex]}
                                                    </div>
                                                    <div className="border p-3 rounded-md bg-white flex-1 text-muted-foreground">
                                                        {option}
                                                    </div>
                                                </div>
                                            ))}
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
