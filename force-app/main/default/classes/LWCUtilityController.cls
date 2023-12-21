public class LWCUtilityController {
    
    @AuraEnabled(cacheable=true)
    public static List<Phone_Number__c> getPhoneNumbers(String phoneProductId) {
        
        String strKey = phoneProductId;
        system.debug('strKey = '+ strKey); 
        List<Phone_Number__c> phNoList = [SELECT Id,Name,Contract_Start_Date__c, Contract_End_Date__c, Phone_Product__c, Pin_number__c, Sim_Number__c 
                            FROM Phone_Number__c WHERE Phone_Product__c = :strKey ];

        system.debug('phNoList = '+ phNoList); 
        return phNoList;
    }


}