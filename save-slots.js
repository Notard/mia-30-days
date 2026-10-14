import {upgradeState} from './growth.js?v=month7';
import {validateState} from './engine.js?v=month7';
export const AUTO_KEY='mia-week-v2',MANUAL_KEY='mia-week-manual-v1';
export function decodeSave(raw){
 if(typeof raw!=='string'||raw.length>300000)return null;
 try{const data=JSON.parse(raw),state=data?.format==='mia-save-v1'?data.state:data;
 if(!validateState(state))return null;
 return {state:upgradeState(state),savedAt:typeof data.savedAt==='string'&&Number.isFinite(Date.parse(data.savedAt))?data.savedAt:null};
 }catch{return null;}
}
export function encodeSave(state,savedAt=new Date().toISOString()){
 if(!validateState(state))throw Error('invalid save');
 return JSON.stringify({format:'mia-save-v1',savedAt,state});
}
export function readSlot(storage,key){const raw=storage.getItem(key);return {save:raw?decodeSave(raw):null,invalid:!!raw&&!decodeSave(raw)};}
