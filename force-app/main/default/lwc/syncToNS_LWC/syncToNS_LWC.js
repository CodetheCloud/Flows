import { LightningElement,api,track } from 'lwc';
import updateContractforNSSync from '@salesforce/apex/synctoNS_LWC_Controller.updateContractforNSSync';

export default class SyncToNS_LWC extends LightningElement {

    /*
    It is our standard @api enabled recordId variable.
    Salesforce will push the recordId into this variable when the page is called from a quick action.
    */
    @api recordId; 
    
    /*
    we will use this var as recursion protection mechanism. 
    renderedCallback will be called multiple times throughout the page’s lifecycle, 
    and we only want to do the setup work once.
    */
    @track completedLoading;  
    @track res; 
    @track displayMsg;


    connectedCallback(){
        console.log('connectedCallback method invoked ++');
        console.log('record id = '+ this.recordId);
        //recordId is not populated when connectedCallback is called by the system.
        console.log('connectedCallback method invoked --');
    }

    renderedCallback(){
        console.log('renderedCallback method invoked ++');
        console.log('record id = '+ this.recordId);
        //Here’s where we do our page setup instead. But since renderedCallback is called several times, 
        //we have some checks to make sure it does work once. 
        //this could be where complex page setup is performed.
        console.log('completedLoading = '+ this.completedLoading);


        if(!this.completedLoading && this.recordId){
            
            // call apex method and update the contract
            let param = {
                'contractId'  : this.recordId
            };

            updateContractforNSSync(param).then( result => {
                this.res = result; 
                console.log(this.res);
                this.completedLoading  = true;
                this.displayMsg = true;
                console.log('Apex method called successfully');
            } ).catch(error => {
                console.log('Do not come up error like this in production');
                this.displayMsg = false;
            });


        }

        
        console.log('connectedCallback method invoked --');
    }
}