<template>
 <div> <span class="inline-block border-default rounded appbg2 p-20">
            <input class="box__file" type="file" name="file" ref="upload" />
            <button @click="uploadAction()">upload</button>
        </span></div>
</template>

<script setup>
const upload = ref();

async function uploadAction() {
    var element = upload.value;
    console.log(element);
    if(element.files.length > 0) {
        var file = element.files[0];
        var text = await file.text();
        //var hash = dhive.cryptoUtils.sha256('ImageSigningChallenge'+text);
        //console.log("hash", hash);
        //var testKey = dhive.PrivateKey.fromSeed('foo');
        //var signature = testKey.sign(hash).toString();
         var user = 'am7-test';
        hive_keychain.requestSignBuffer(user, 'ImageSigningChallenge'+text, "Posting", (result)=>{
            if(result.success) {
                var signature = result.result;
                console.log("signature", signature);

                /*const formData  = new FormData();
                formData.append(user, 'bar');
                formData.append("image_file", file);

                const response = await fetch(url, {
                    method: 'POST',
                    body: formData
                });
                console.log("response", response);*/


            }
        });
        
    } 
}
</script>


