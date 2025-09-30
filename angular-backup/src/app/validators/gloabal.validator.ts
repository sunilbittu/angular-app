import { AbstractControl, FormControl, ValidatorFn } from "@angular/forms";




//checking email,phonenumber,username exits validator and apply dynamically
export function gloabalMatching(parameter : string):ValidatorFn {

    return (contorl : AbstractControl): {[key : string]: any} | null =>{

        //converting string RegExp value
        const reg = new RegExp(parameter);

        const gloabalParam = reg.test(contorl.value);  
        return gloabalParam ? {'errorFlag': {value : contorl.value}} : null;
    };

}



export function noWhitespace(control: FormControl) {
    let isWhitespace = (control.value || '').trim().length === 0;
    let isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true }
}