import { NodeVM } from 'vm2';

const Code = async (userCode) => {
    // Setup NodeVM
    const vm = new NodeVM({
        console: 'redirect', // capture console.log
        timeout: 2000,       // 2 seconds max
        sandbox: {},
    });

    let logs = [];
    vm.on('console.log', (msg) => logs.push(msg));

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
        // const testCase = {
        //     input: [1, 2],
        //     expected: 3,
        //     output: 2 + 2,
        //     passed: false,
        //     message: "Output did not match expected",
        //     consolelogs: logs.map(item => item)
        //   };
        console.log("results:", results);

        let pass = 0;
        for (let element of results) {
            if (element.passed == true) {
                pass += 1;
            }
        }
        if (pass == 2) {
            console.log(pass)
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

            }
        } else {
            console.log(pass)
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
            }
        }
    } catch (error) {
        return {
            success: false,
            message: error.message,
        };
    }
};

export default Code;