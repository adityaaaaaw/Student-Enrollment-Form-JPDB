var jpdbBaseURL = "http://api.login2explore.com:5577";
var jpdbIML = "/api/iml";
var jpdbIRL = "/api/irl";

var connToken = "90935133|-31949241090224165|90903721";

var dbName = "SCHOOL-DB";
var relName = "STUDENT-TABLE";

var recNo = null;

function disableFields() {
    $("#fullName").prop("disabled", true);
    $("#studentClass").prop("disabled", true);
    $("#birthDate").prop("disabled", true);
    $("#address").prop("disabled", true);
    $("#enrollmentDate").prop("disabled", true);
}

function enableFields() {
    $("#fullName").prop("disabled", false);
    $("#studentClass").prop("disabled", false);
    $("#birthDate").prop("disabled", false);
    $("#address").prop("disabled", false);
    $("#enrollmentDate").prop("disabled", false);
}

function resetForm() {

    $("#rollNo").val("");
    $("#fullName").val("");
    $("#studentClass").val("");
    $("#birthDate").val("");
    $("#address").val("");
    $("#enrollmentDate").val("");

    $("#rollNo").prop("disabled", false);

    disableFields();

    $("#saveBtn").prop("disabled", true);
    $("#updateBtn").prop("disabled", true);
    $("#resetBtn").prop("disabled", true);

    recNo = null;

    $("#rollNo").focus();
}

function validateData() {

    var roll = $("#rollNo").val();
    var name = $("#fullName").val();
    var cls = $("#studentClass").val();
    var birth = $("#birthDate").val();
    var address = $("#address").val();
    var enroll = $("#enrollmentDate").val();

    if (roll === "") {
        alert("Roll No is required");
        $("#rollNo").focus();
        return "";
    }

    if (name === "") {
        alert("Full Name is required");
        $("#fullName").focus();
        return "";
    }

    if (cls === "") {
        alert("Class is required");
        $("#studentClass").focus();
        return "";
    }

    if (birth === "") {
        alert("Birth Date is required");
        $("#birthDate").focus();
        return "";
    }

    if (address === "") {
        alert("Address is required");
        $("#address").focus();
        return "";
    }

    if (enroll === "") {
        alert("Enrollment Date is required");
        $("#enrollmentDate").focus();
        return "";
    }

    var jsonObj = {
        "Roll-No": roll,
        "Full-Name": name,
        "Class": cls,
        "Birth-Date": birth,
        "Address": address,
        "Enrollment-Date": enroll
    };

    return JSON.stringify(jsonObj);
}

function getStudent() {

    var roll = $("#rollNo").val();

    if (roll === "") {
        return;
    }

    var jsonObj = {
        "Roll-No": roll
    };

    var getReq = createGET_BY_KEYRequest(
            connToken,
            dbName,
            relName,
            JSON.stringify(jsonObj)
            );

    jQuery.ajaxSetup({async: false});

    var resultObj = executeCommandAtGivenBaseUrl(
            getReq,
            jpdbBaseURL,
            jpdbIRL
            );

    jQuery.ajaxSetup({async: true});

    if (resultObj.status === 400) {

        enableFields();

        $("#saveBtn").prop("disabled", false);
        $("#updateBtn").prop("disabled", true);
        $("#resetBtn").prop("disabled", false);

        $("#fullName").focus();

    } else {

        recNo = JSON.parse(resultObj.data).rec_no;

        var data = JSON.parse(resultObj.data).record;

        $("#fullName").val(data["Full-Name"]);
        $("#studentClass").val(data["Class"]);
        $("#birthDate").val(data["Birth-Date"]);
        $("#address").val(data["Address"]);
        $("#enrollmentDate").val(data["Enrollment-Date"]);

        enableFields();

        $("#rollNo").prop("disabled", true);

        $("#saveBtn").prop("disabled", true);
        $("#updateBtn").prop("disabled", false);
        $("#resetBtn").prop("disabled", false);

        $("#fullName").focus();
    }
}

function saveStudent() {

    var jsonStr = validateData();

    if (jsonStr === "") {
        return;
    }

    var putReq = createPUTRequest(
            connToken,
            jsonStr,
            dbName,
            relName
            );

    jQuery.ajaxSetup({async: false});

    var resultObj = executeCommandAtGivenBaseUrl(
            putReq,
            jpdbBaseURL,
            jpdbIML
            );

    jQuery.ajaxSetup({async: true});

    alert("Record Saved Successfully");

    resetForm();
}

function updateStudent() {

    var jsonStr = validateData();

    if (jsonStr === "") {
        return;
    }

    var updateReq = createUPDATERecordRequest(
            connToken,
            jsonStr,
            dbName,
            relName,
            recNo
            );

    jQuery.ajaxSetup({async: false});

    var resultObj = executeCommandAtGivenBaseUrl(
            updateReq,
            jpdbBaseURL,
            jpdbIML
            );

    jQuery.ajaxSetup({async: true});

    alert("Record Updated Successfully");

    resetForm();
}

$(document).ready(function () {
    resetForm();
});