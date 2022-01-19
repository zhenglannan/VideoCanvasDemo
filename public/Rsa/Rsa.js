/*var  PublicKey= "MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCh9k6csAFCR8FArmTSyBChJLMpvEmGpK1SsxwttmWUF1SHh1+Zf0pooW1ts6CPdL9a7BBwfFGcF2q0s540jMzSlwvIz9qEfsPducVGSEZ03CHVj17DQrqrZbSTPgUnXi1g4hofd4lO3DKkpS4SeskbAdICeNqmxgLWz3EUhcUnXwIDAQAB";*/
var PublicKey="MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEAlZ84hdpAXgjNxTlx72Si9SK+83CUtUpWxxyIPz7mdX6uB/gb8tyzFyAysMIsAIFUiFlSOu04CQzyGvRSlVidsUk+n7K+GG3aNE23YJyQyaJrm52VRkcJrgrtQLarOVEvxakEmzfXhR3ZDoQfoDx9AuTDJIdElOxhhTjG8o3t4MrsGACe2EfY/ddwlmA/SUBX55dUCYv0ArswTRq3UUykmM4/hswO2qVDWDS0ENRqZGgRFGYaFgf7wOZwmdnr7Gf0VLgnlM63X82QWdDXAbHara+lQ20tHDkba6pu+A4onE76qNGU1i5W3iOI+depkKKj5HrupDG82/fg2ITMQT5aMB3i2mPIm5p1KsCC5M4waUCevB4BkxKX4ryeo0E/p8HpcmTiMNkXs2ddfUkewppGf7HxI1/JqMi0vpmEugKb1qQBKJjAKWlSPhGy4pyikOxTD5vbZzc3yDVPiORMIQpijgkAI5gBd21+ipSdLatp05bBiWlN/1D2/fdCO8fUM166WW7gddKzi1n30UE3Rm9BKWWvBm48v1pukWrI20sQNx8rZq9BZeFU0ekadkbjnHDTTakVY5NMgfbRulmoU2wXEScAS3rpC2Hf41VO2H5kTgYKMzWrDcazCG10XZdY4baTVINRfDSo25ZSNQazE81JFkGUkCc8ILdqynmy7CLNL30CAwEAAQ==";
function f_encrypt(str){
	var repStr= str.replace(/\=/g,"%2d");//替换字符串中的=号	
	var encrypt = new JSEncrypt();
	encrypt.setPublicKey(PublicKey);
	var mdata= encrypt.encrypt(repStr);
	var mdataRep= mdata.replace(/\+/g,"%2B");//替换字符串中的+号
	//console.log(mdata);
	//console.log(mdataRep);
	
	return mdataRep;
}

function f_encryptStr(str){
	var repStr= str.replace(/\=/g,"%2d");//替换字符串中的=号	
	var encrypt = new JSEncrypt();
	encrypt.setPublicKey(PublicKey);
	var mdata= encrypt.encrypt(repStr);
	var mdataRep= mdata.replace(/\+/g,"%2B");//替换字符串中的+号
	var mdataStr= mdataRep.replace(/\=/g,"%2d");//替换字符串中的+号
	//console.log(mdata);
	//console.log(mdataRep);
	
	return mdataStr;
}
