function connectToDb() {
    return(window.openDatabase("applicationDb", "1.0", 'appDb"', 2000000))
}

function initDb() {

    var dbShell = connectToDb();
    dbShell.transaction(createTables, onError, function () {
        alert("IN SUCCESS");
    })
}

function onError(error) {
    alert("Error Creating Database, error code is" + error.code + " . Error message is " + error.message);
}

function createTables(tx) {
    tx.executeSql('DROP TABLE Template');
    tx.executeSql('DROP TABLE Page');
    tx.executeSql('DROP TABLE Parent_page');
    tx.executeSql('DROP TABLE Child_page');
    tx.executeSql('CREATE TABLE IF NOT EXISTS Page(id Integer primary key autoincrement, content longBlob,title text not null,template_id Integer)');
    tx.executeSql('CREATE TABLE IF  NOT EXISTS Parent_page(page_id Integer, parent_id Integer)');
    tx.executeSql('CREATE TABLE IF  NOT EXISTS Child_page(page_id Integer, child_id Integer)');
    tx.executeSql('CREATE TABLE IF  NOT EXISTS Template(id Integer primary key autoincrement,name Text not null,templateContent longBlob)');
    tx.executeSql('CREATE TABLE IF NOT EXISTS Config_settings(config_name text,config_value blob)');
    tx.executeSql('CREATE TABLE IF NOT EXISTS binary_content(content_name text,content_value longblob,content_type text)');
}

function populateDb() {

    var dbShell = connectToDb();
    dbShell.transaction(populateTables, onError, function(){

        alert("Populate Success");

    })


}

function populateTables(tx) {
    tx.executeSql(' INSERT into Template(name,templateContent) values("menu_template",\''+"<html><body> this is Content of Menu page</body></html>".sqlFriendlyByteArray()+'\')');
    tx.executeSql(' INSERT into Template(name,templateContent) values("page_template",\''+"<html><body> this is Content page</body></html>".sqlFriendlyByteArray()+'\')');
    tx.executeSql('INSERT into Page(content,title,template_id) values(\''+"Main Page Content".sqlFriendlyByteArray()+'\',"main page",1)');
    tx.executeSql('INSERT into Page(content,title,template_id) values(\''+"Sub Page Content".sqlFriendlyByteArray()+'\',"Sub Page",2)');
    tx.executeSql(' INSERT into Parent_page(page_id,parent_id) values(2,1)');
    tx.executeSql(' INSERT into Child_page(page_id,child_id) values(1,2)');

}

function stringToBytes(str) {
    var bytes = [];
    for (var i = 0; i < str.length; i++) {
        bytes.push(str.charCodeAt(i).toString(16));
    }
    return bytes;
}

function queryDb(){
    var dbShell = connectToDb();
    dbShell.transaction(queryTables, onError);
}

function queryTables(tx){
               tx.executeSql(' SELECT * from Template',[],onSuccess,onError);
               tx.executeSql(' SELECT * from Page',[],onPageSuccess,onError);
               tx.executeSql(' SELECT * from Child_page',[],onChildSuccess,onError);
               tx.executeSql(' SELECT * from Parent_page',[],onParentSuccess,onError);
}

function onSuccess(tx,results){
   var length=results.rows.length;
    for(i=0;i<length;i++){
        alert(results.rows.item(i).id +" : "+results.rows.item(i).templateContent+" : "+results.rows.item(i).name);
    }
}
function onPageSuccess(tx,results){
   var length=results.rows.length;
    for(i=0;i<length;i++){
        alert(results.rows.item(i).id +" : "+results.rows.item(i).content+" : "+results.rows.item(i).title+" : "+results.rows.item(i).template_id);
    }
}
function onChildSuccess(tx,results){
   var length=results.rows.length;
    for(i=0;i<length;i++){
        alert(results.rows.item(i).page_id+" : "+results.rows.item(i).child_id);
    }
}
function onParentSuccess(tx,results){
   var length=results.rows.length;
    for(i=0;i<length;i++){
        alert(results.rows.item(i).page_id+" : "+results.rows.item(i).parent_id);
    }
}

String.prototype.sqlFriendlyByteArray = function(){
    return "[" + stringToBytes(this) + "]";
};
