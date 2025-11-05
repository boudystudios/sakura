
import { GoogleGenAI, Type } from "@google/genai";
import { Dish } from '../types';
import { MENU_CATEGORIES } from '../constants';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const dishSchema = {
  type: Type.OBJECT,
  properties: {
    name: {
      type: Type.STRING,
      description: 'The name of the dish.'
    },
    category: {
      type: Type.STRING,
      description: 'The category of the dish from the provided list.'
    },
    description: {
      type: Type.STRING,
      description: 'A brief, appealing description of the dish.'
    },
    price: {
      type: Type.NUMBER,
      description: 'The price of the dish in Euros.'
    },
    imageUrl: {
      type: Type.STRING,
      description: 'A placeholder image URL from `https://picsum.photos/400/300?random=SEED` where SEED is a random integer.'
    },
     allergens: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: 'A list of potential allergens, if any.'
    }
  },
  required: ['name', 'category', 'description', 'price', 'imageUrl']
};

export const generateDishes = async (query: string): Promise<Dish[]> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `The user wants to see dishes from our menu. Based on their request: "${query}", generate a list of 5 relevant dishes. If the request is generic like "show me the menu", provide a variety of popular items.`,
      config: {
        systemInstruction: `You are the menu assistant for "Sakura China & Japan Restaurant". Your menu covers a vast range of categories: ${MENU_CATEGORIES.join(', ')}. Your only job is to return a JSON array of dishes that match the user's request. Always adhere to the provided JSON schema. Do not return anything other than the JSON array.`,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: dishSchema,
        },
      },
    });

    const jsonString = response.text.trim();
    const rawDishes = JSON.parse(jsonString);
    
    // FIX: Safely map the partial AI response to the full Dish type to ensure UI components receive all required props.
    const dishes: Dish[] = rawDishes.map((dish: any, index: number) => ({
      _id: `ai-dish-${index}`,
      name: dish.name || "Senza nome",
      category: dish.category || "Senza categoria",
      description: dish.description || "",
      price: dish.price || 0,
      imageUrl: dish.imageUrl || "https://picsum.photos/400/300?random=0",
      available: true, // Assume AI generated dishes are available
      ingredients: [], // Not provided by AI
      type: [], // Not provided by AI
      religionTags: ['None'], // Not provided by AI
      allergens: dish.allergens || [],
    }));
    return dishes;
  } catch (error) {
    console.error('Error generating dishes with Gemini:', error);
    // In case of an API error, return a mock error dish that conforms to the `Dish` type.
    return [{
      _id: 'error-dish-0',
      name: "Error retrieving menu",
      category: "System",
      description: "There was an issue contacting our AI assistant. Please try again later.",
      price: 0,
      imageUrl: "https://picsum.photos/400/300?random=0",
      type: [],
      ingredients: [],
      allergens: [],
      religionTags: ['None'],
      available: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }];
  }
};
