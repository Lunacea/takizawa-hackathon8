import { Client, Databases } from 'appwrite';

type Request = {
    variables: {
        APPWRITE_FUNCTION_ENDPOINT: string;
        APPWRITE_FUNCTION_PROJECT_ID: string;
        APPWRITE_FUNCTION_API_KEY: string;
        DB_ID: string;
    },
    payload: string;
}

type Response = {
    json: (data: object, statusCode?: number) => void;
    send: (text: string, statusCode?: number) => void;
}

type User = {
    $id: string;
    name: string;
    email: string;
}

// この関数実装は不要になりました（クライアント側でプロフィールを自動作成）。
export default async () => {
    return;
}
