interface TestProps {
    test: {
      slug: string;
      name: string;
      imageUrl?: string;
      description: string;
      details: {
        durationMinutes: number;
        totalQuestions: number;
      };
    };
  }
  
  export default TestProps;
  