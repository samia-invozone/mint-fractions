const fs = require('fs');

(async () => { 

    //reading json
    let path =  "./nfts/0.json";
    var json = require(path);
    console.log(json);

    //playing with properties
    if (json.hasOwnProperty('name1')){
        console.log("yay got it");
    }
    json['name'] = "helo brother";
    console.log(json);
    json['attributes'].push(
        { "trait_type": 'Layer-1', "value": '0' }
    );
    console.log(json);
    json['name'] = json['name']+"123";
    console.log(json);

    //converting json object to string and saving json
    const data = JSON.stringify(json);
    fs.writeFile('./nfts/1.json', data, (err) => {
        if (err) {
            throw err;
        }
        console.log("JSON data is saved.");
    });

})();
