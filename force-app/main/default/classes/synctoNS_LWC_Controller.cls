public  class synctoNS_LWC_Controller {
    

    @AuraEnabled
    public static string updateContractforNSSync(Id contractId){
        system.debug('contract id as param = '+ contractId);

        Contract con = new Contract(); 
        con.Id = contractId; 
        con.Push_To_NetSuite__c = true; 
        try{
            update con; 
            return 'success =' + con;
        }catch(Exception ex){
            return 'error =' + ex; 
        }

    }
}