import axios from "axios";
export interface TestQuestion {
    id: number;
    test_id: number;
    question_text: string;
    question_number: number;
    is_positive: boolean;
    dimension: string;
    is_active: boolean;
    created_at: string;
}

export interface TestInterpretation {
    id: number;
    gender: string;
    level_name: string;
    min_score: number;
    max_score: number;
    title: string;
    description: string;
    recommendation: string;
    sessions_required: string;
    dimension: string;
    created_at: string;
}

const base_url = process.env.NEXT_PUBLIC_BASE_URL;

const getTestQuestions = async () => {
    try {
        const response = await axios.get<TestQuestion[]>(
          `${base_url}/edits/academic/get_questions.php`
        );
        return response.data;
    } catch (error) {
        console.error("Error fetching test questions:", error);
        throw error;
    }
}

const getTestInterpretations = async () => {
    try {
        const response = await axios.get<TestInterpretation[]>(
          `${base_url}/edits/academic/get_interpretations.php`
        );
        return response.data;
    } catch (error) {
        console.error("Error fetching test interpretations:", error);
        throw error;
    }
}

export const getTestData = async()=>{
    try {
        const questions = await getTestQuestions();
        const interpretations = await getTestInterpretations();
        return { questions, interpretations };
    } catch (error) {
        console.error("Error fetching test data:", error);
        throw error;
    }
}

export const updateTestQuestion = async (question: TestQuestion[]) => {
    try {
        await axios.post(
          `${base_url}/edits/academic/set_question.php`,
          question
        );
        return true
    } catch (error) {
        console.error("Error updating test question:", error);
        return false;
    }
}

export const updateTestInterpretation = async (interpretation: TestInterpretation[]) => {
    try {
        await axios.post(
          `${base_url}/edits/academic/set_interpretation.php`,
          interpretation
        );
        return true
    } catch (error) {
        console.error("Error updating test interpretation:", error);
        return false;
    }
}