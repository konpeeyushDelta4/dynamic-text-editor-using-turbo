interface defaultSuggestionsProps {
    id: string | number; 
    label: string;
    value: string;
    category: string;
    description: string;
    link?: string;
    icon?: string;
    type?: string;
    [key: string]: unknown;
}


export const defaultSuggestions: defaultSuggestionsProps[] = [
    {
        id: 1,
        label: "eq(a, b)",
        value: "eq(a, b)",
        description: "Returns true if a equals b",
        category: "Equality and Comparison",
        type: "function",
        link: "https://docs.yourgpt.ai/chatbot/template-functions/",
    },
    {
        id: 2,
        label: "gt(a, b)",
        value: "gt(a, b)",
        description: "Returns true if a is greater than b",
        category: "Equality and Comparison",
        type: "function",
        link: "https://docs.yourgpt.ai/chatbot/template-functions/",
    },
    {
        id: 3,
        label: "lt(a, b)",
        value: "lt(a, b)",
        description: "Returns true if a is less than b",
        category: "Equality and Comparison",
        type: "function",
        link: "https://docs.yourgpt.ai/chatbot/template-functions/",
    },
    {
        id: 4,
        label: "and(...args)",
        value: "and(...args)",
        description: "Returns true if all arguments are truthy",
        category: "Logical Operations",
        type: "function",
        link: "https://docs.yourgpt.ai/chatbot/template-functions/",
    },
    {
        id: 5,
        label: "or(...args)",
        value: "or(...args)",
        description: "Returns true if at least one argument is truthy",
        category: "Logical Operations",
        type: "function",
        link: "https://docs.yourgpt.ai/chatbot/template-functions/",
    },
    {
        id: 6,
        label: "not(value)",
        value: "not(value)",
        description: "Returns the negation of the provided value",
        category: "Logical Operations",
        type: "function",
        link: "https://docs.yourgpt.ai/chatbot/template-functions/",
    },
    {
        id: 7,
        label: "uppercase(str)",
        value: "uppercase(str)",
        description: "Converts a string to uppercase",
        category: "String Manipulation",
        type: "function",
        link: "https://docs.yourgpt.ai/chatbot/template-functions/",
    },
    {
        id: 8,
        label: "lowercase(str)",
        value: "lowercase(str)",
        description: "Converts a string to lowercase",
        category: "String Manipulation",
        type: "function",
        link: "https://docs.yourgpt.ai/chatbot/template-functions/",
    },
    {
        id: 9,
        label: "trim(str)",
        value: "trim(str)",
        description: "Removes whitespace from both ends of a string",
        category: "String Manipulation",
        type: "function",
        link: "https://docs.yourgpt.ai/chatbot/template-functions/",
    },
    {
        id: 10,
        label: "concat(...args)",
        value: "concat(...args)",
        description: "Joins multiple strings into one",
        category: "String Manipulation",
        type: "function",
        link: "https://docs.yourgpt.ai/chatbot/template-functions/",
    },
    {
        id: 11,
        label: "isset(value)",
        value: "isset(value)",
        description: "Returns true if the value is not undefined or null",
        category: "Conditional Checks",
        type: "function",
        link: "https://docs.yourgpt.ai/chatbot/template-functions/",
    },
    {
        id: 12,
        label: "includes(data, searchValue)",
        value: "includes(data, searchValue)",
        description: "Checks if data contains searchValue (works with strings, arrays, and objects)",
        category: "Conditional Checks",
        type: "function",
        link: "https://docs.yourgpt.ai/chatbot/template-functions/",
    },
    {
        id: 13,
        label: "date(date, format, timezone)",
        value: "date(date, format, timezone)",
        description: "Formats a date according to the given format and timezone",
        category: "Date and Time",
        type: "function",
        link: "https://docs.yourgpt.ai/chatbot/template-functions/",
    },
    {
        id: 14,
        label: "day(date, timezone)",
        value: "day(date, timezone)",
        description: "Returns the day of the week for a given date",
        category: "Date and Time",
        type: "function",
        link: "https://docs.yourgpt.ai/chatbot/template-functions/",
    },
    {
        id: 15,
        label: "json stringify(context)",
        value: "json stringify(context)",
        description: "Converts a context object into a JSON string",
        category: "JSON Utilities",
        type: "function",
        link: "https://docs.yourgpt.ai/chatbot/template-functions/",
    },
    {
        id: 16,
        label: "Flow.last_response",
        value: "Flow.last_response",
        description: "Use the last response (if set from the flow)",
        category: "Flow",
        type: "variable",
    },
    {
        id: 17,
        label: "FLOW.last_utterance",
        value: "FLOW.last_utterance",
        description: "The last message from the visitor",
        category: "Flow",
        type: "variable",
    },
    {
        id: 18,
        label: "FLOW.{variable_of_your_choice}",
        value: "FLOW.{variable_of_your_choice}",
        description: "Use any variable from the flow by its name",
        category: "Flow",
        type: "variable",
    },
    {
        id: 19,
        label: "SESSION.status",
        value: "SESSION.status",
        description: "The status of the session",
        category: "Session",
        type: "variable",
    },
    {
        id: 20,
        label: "VISITOR.name",
        value: "VISITOR.name",
        description: "The name of the visitor",
        category: "Visitor",
        type: "variable",
    },
    {
        id: 21,
        label: "VISITOR.region",
        value: "VISITOR.region",
        description: "The region of the visitor",
        category: "Visitor",
        type: "variable",
    },
    {
        id: 22,
        label: "VISITOR.language",
        value: "VISITOR.language",
        description: "The language of the visitor",
        category: "Visitor",
        type: "variable",
    },
    {
        id: 23,
        label: "CONTACT.name",
        value: "CONTACT.name",
        description: "The name of the contact",
        category: "Contact",
        type: "variable",
    },
    {
        id: 24,
        label: "CONTACT.email",
        value: "CONTACT.email",
        description: "The email of the contact",
        category: "Contact",
        type: "variable",
    },
    {
        id: 25,
        label: "CONTACT.phone",
        value: "CONTACT.phone",
        description: "The phone of the contact",
        category: "Contact",
        type: "variable",
    },
    {
        id: 26,
        label: "CONTACT.company",
        value: "CONTACT.company",
        description: "The company of the contact",
        category: "Contact",
        type: "variable",
    },
    {
        id: 27,
        label: "CONTACT.country",
        value: "CONTACT.country",
        description: "The country of the contact",
        category: "Contact",
        type: "variable",
    },
    {
        id: 28,
        label: "CONTACT.city",
        value: "CONTACT.city",
        description: "The city of the contact",
        category: "Contact",
        type: "variable",
    },
    {
        id: 29,
        label: "CONTACT.region",
        value: "CONTACT.region",
        description: "The region of the contact",
        category: "Contact",
        type: "variable",
    },
    {
        id: 30,
        label: "CONTACT.tags",
        value: "CONTACT.tags",
        description: "The tags of the contact",
        category: "Contact",
        type: "variable",
    },
];
