import axios from "axios";
const base_url = process.env.NEXT_PUBLIC_BASE_URL;
export const fetchTests = async () => {
    try{
        const response = await axios.get(`${base_url}/tests/get_all_tests.php`);
        return response.data.tests || [];

    }
    catch(error){
        console.log(error);
        return [];
}
}