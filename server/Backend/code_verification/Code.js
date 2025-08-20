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
    { input: [1, 2], expected: 3 },
    { input: [5, 7], expected: 12 },
    // Add more test cases as needed
  ];
  console.log(userCode.code)
  try {
    // Ensure the user code exports the function
    const userFunction = vm.run(`
      ${userCode.code}
      module.exports = twosum;
    `);

    // Execute test cases
    const results = testCases.map((tc) => {
      const output = userFunction(...tc.input);
    //   return {
    //     input: tc.input,
    //     expected: tc.expected,
    //     output,
    //     passed: output === tc.expected,
    //   };
    console.log(output);
    });
    let pass=0;
    for (let element of results) {
        if(element.passed==true){
            pass+=1;
        }
    }
    if (pass==2) {
        return {
          success: true,
          message:'done hogaya' 
            // results,
            // logs, 
        }
    }else{
        return {
          success: false,
          message:'nhi hua' 
            // results,
            // logs, 
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
