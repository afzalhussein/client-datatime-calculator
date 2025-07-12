// __mocks__/hooks.js
export const useDateTimeOperations = jest.fn();
export const useDateTimeDifference = jest.fn();

// __mocks__/DateTimeOperationForm.js
export default function DateTimeOperationForm ( props ) {
    return <div data-testid="operation-form">Operation Form</div>;
}

// __mocks__/DateTimeDifferenceForm.js
export default function DateTimeDifferenceForm ( props ) {
    return <div data-testid="difference-form">Difference Form</div>;
}

// __mocks__/ResultDisplay.js
export default function ResultDisplay ( { result } ) {
    return <div data-testid="result-display">{ JSON.stringify( result ) }</div>;
}
