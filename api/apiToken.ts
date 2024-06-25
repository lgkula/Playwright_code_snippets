import { writeObjectToFile } from "../jsonFileController";

// Pobiera token z systemu autoryzacji i zapisuje go do pliku
export const getAuthToken = async (
    clientId: string = process.env.CLIENT_ID,
    clientSecret: string = process.env.CLIENT_SECRET,
    tokenUrl: string = process.env.TOKEN_URL,
    scope: string = process.env.SCOPE,
) => {
    // Zakodowanie klienta ID i sekretu w formacie Base64
    const credentials = btoa(`${clientId}:${clientSecret}`);

    // Przygotowanie body requestu
    const body = new URLSearchParams();
    body.append('grant_type', 'client_credentials');
    body.append('scope', scope);

    // Przygotowanie parametrów requestu
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: `Basic ${credentials}`,
        },
        body: body.toString(),
    };

    try {
        // Wysłanie requestu POST do endpointu tokenu
        const response: Response = await fetch(tokenUrl, requestOptions);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}, ${response.statusText}`);
        }

        // Parsowanie response do formatu JSON
        const responseAccessToken = (await response.json()).access_token;

        // Zapisywanie do tokenu do pliku
        const accessTokenObject = {
            Authorization: `Bearer ${responseAccessToken}`,
        };

        await writeObjectToFile(
            accessTokenObject,
            '../playwright/.auth/accessToken.json',
        );

        // Zwrócenie tokenu
        return accessTokenObject;
    } catch (error) {
        console.error('Error fetching the token:', error);
        throw error;
    }
};
