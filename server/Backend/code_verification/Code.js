import { NodeVM, VM } from 'vm2';

const Code = async (userCode) => {
    // Step 1: Pre-validate syntax with VM class
    try {
        const syntaxVM = new VM({ timeout: 1000 });
        syntaxVM.run(userCode.code);
    } catch (syntaxError) {
        return {
            success: false,
            message: `Syntax Error: ${syntaxError.message}`,
            type: 'syntax'
        };
    }

    // Step 2: Setup NodeVM for actual execution
    const vm = new NodeVM({
        console: 'redirect', // capture console.log
        timeout: 2000,       // 2 seconds max
        sandbox: {},
    });

    let logs = [];
    // vm.on('console.log', (msg) => logs.push(msg));

    // Define test cases
    const testCases = [
        // { input: [1, 2], expected: 3 },
        { input: [5, 7], expected: 12 },
        // Add more test cases as needed
    ];

    try {
        // Ensure the user code exports the function
        const userFunction = vm.run(`
            ${userCode.code}
            module.exports = twosum;
        `);

        // Execute test cases
        const results = testCases.map((tc) => {
            const output = userFunction(...tc.input);
            return {
                input: tc.input,
                expected: tc.expected,
                output,
                passed: output === tc.expected,
            };
        });

        let pass = 0;

        for (let element of results) {
            if (element.passed == true) {
                pass += 1;
            }
        }

        if (pass == 2) {
            return {
                success: true,
                message: {
                    input: results[0].input,
                    expected: results[0].expected,
                    output: results[0].output,
                    passed: true,
                    message: "Output did match expected",
                    ...(logs.length > 0 && { consolelogs: logs.map(item => item) })
                }
            };
        } else {
            return {
                success: false,
                message: {
                    input: results[0].input,
                    expected: results[0].expected,
                    output: results[0].output,
                    passed: false,
                    message: "Output did not match expected",
                    ...(logs.length > 0 && { consolelogs: logs.map(item => item) })
                }
            };
        }
    } catch (error) {
        // Handle runtime errors, reference errors, etc.
        return {
            success: false,
            message: {
                message:`Runtime Error: ${error.message}`},
        };
    }
};

export default Code;