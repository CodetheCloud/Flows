@isTest
public class synctoNS_LWC_Controller_Test {


    @testSetup 
    static void setup() {

        Account ac = new Account();
        ac.name = 'test acccount';
        ac.Phone= '8739380393';
        insert ac;

        Contract con = new Contract(); 
        con.AccountId = ac.Id;
        con.StartDate = system.today();
        con.ContractTerm = 180; 
        insert con; 


    }
    
    @isTest
    public static void test1(){
        contract con = [select id, name from contract limit 1];
        String res = synctoNS_LWC_Controller.updateContractforNSSync(con.Id);
        system.assert(res.contains('success') , 'Uh oh! Unable to update the Contract record for NS Sync');
    }
    
}