import { NodeVM } from 'vm2';

const Code =async (userCode) =>{
    const vm = new NodeVM({
        console: 'redirect',
        timeout: 2000,
        sandbox: {},
    });
    
    let testCases=1;
    
    let logs = [];
    vm.on('console.log', msg => logs.push(msg));
    
    try {
        const userFunction = vm.run(`${userCode}; module.exports = twoSum;`)
        const results = testCases.map(tc => {
            const output = userFunction(...tc.input);
            console.log(output)
            return {
                success:true,
                message:'done'
            };
            // {input: tc.input,
            //     expected: tc.expected,
            //     output,
            //     passed: output === tc.expected}
        });
        return{
            success:true,
            message:results
        }
    
    } catch (error) {
        return{
            success: false,
            message: error
        }
    }
}
export default Code;