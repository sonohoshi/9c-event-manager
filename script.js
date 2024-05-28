import { Octokit } from "https://esm.sh/@octokit/rest";
import { Base64 } from 'https://cdn.jsdelivr.net/npm/js-base64@3.7.7/base64.mjs';

// Markdown Converter
document.getElementById('fileInput').addEventListener('change', function (event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const content = e.target.result.replace(/\n/g, '\\n');
            document.getElementById('outputText').textContent = content;
        };
        reader.readAsText(file);
    }
});

// Event JSON Generator
// ... (Event JSON Generator JavaScript 코드를 여기에 추가) ...
function inputToRenderTable() {
    const priority = parseInt(document.getElementById('priorityInput').value);
    const bannerImageName = document.getElementById('bannerImageInput').files[0]?.name.split('.')[0];
    const popupImageName = document.getElementById('popupImageInput').files[0]?.name.split('.')[0];
    const useDateTime = document.getElementById('useDateTime').checked;
    const beginDateTime = useDateTime ? document.getElementById('beginDateTimeInput').value + ':00' : '';
    const endDateTime = useDateTime ? document.getElementById('endDateTimeInput').value + ':00' : '';
    const url = document.getElementById('urlInput').value;
    const useAgentAddress = document.getElementById('useAgentAddress').checked;
    const description = document.getElementById('descriptionInput').value;

    const jsonOutput = {
        Priority: priority,
        BannerImageName: bannerImageName,
        PopupImageName: popupImageName,
        UseDateTime: useDateTime,
        BeginDateTime: beginDateTime,
        EndDateTime: endDateTime,
        Url: url,
        UseAgentAddress: useAgentAddress,
        Description: description
    };

    var realJson = new Object()
    realJson.Banners = runtimeList
    document.getElementById('outputJson').textContent = JSON.stringify(realJson, null, 0);
    runtimeList.push(jsonOutput)
    renderTable(runtimeList)
}

// Event JSON Modifier
// ... (Event JSON Modifier JavaScript 코드를 여기에 추가) ...
var runtimeList = Array();
var tableElement;
function renderTable(serializedList) {
    runtimeList = serializedList
    if (tableElement != null) {
        tableElement.remove()
        console.log("remove table")
    }
    // creates a <table> element and a <tbody> element
    const tbl = document.createElement("table");
    tableElement = tbl
    tbl.id = "tableElement"
    const tblBody = document.createElement("tbody");
    var firstRow = document.createElement("tr");
    var tdElement = document.createElement("td")
    tdElement.appendChild(document.createTextNode("삭제 버튼"))
    firstRow.appendChild(tdElement)
    tdElement = document.createElement("td")
    tdElement.appendChild(document.createTextNode("배너 파일 이름"))
    firstRow.appendChild(tdElement)
    tdElement = document.createElement("td")
    tdElement.appendChild(document.createTextNode("팝업 파일 이름"))
    firstRow.appendChild(tdElement)
    tdElement = document.createElement("td")
    tdElement.appendChild(document.createTextNode("배너 이미지"))
    firstRow.appendChild(tdElement)
    tdElement = document.createElement("td")
    tdElement.appendChild(document.createTextNode("팝업 이미지"))
    firstRow.appendChild(tdElement)
    tdElement = document.createElement("td")
    tdElement.appendChild(document.createTextNode("이벤트 시작 날짜"))
    firstRow.appendChild(tdElement)
    tdElement = document.createElement("td")
    tdElement.appendChild(document.createTextNode("이벤트 종료 날짜"))
    firstRow.appendChild(tdElement)
    tdElement = document.createElement("td")
    tdElement.appendChild(document.createTextNode("이벤트 url"))
    firstRow.appendChild(tdElement)
    tdElement = document.createElement("td")
    tdElement.appendChild(document.createTextNode("이벤트 설명"))
    firstRow.appendChild(tdElement)
    tblBody.appendChild(firstRow)

    serializedList.sort((a, b) => a.Priority - b.Priority);
    // creating all cells
    serializedList.forEach(s => {
        const row = document.createElement("tr");

        const buttonTd = document.createElement("td")
        const removeButton = document.createElement("button")
        removeButton.textContent = "삭제"
        removeButton.onclick = e => {
            const index = runtimeList.findIndex(data => data.Description == s.Description)
            runtimeList.splice(index, 1)
            renderTable(runtimeList)
        }
        buttonTd.appendChild(removeButton)
        row.appendChild(buttonTd);

        const bannerNameTd = document.createElement("td")
        bannerNameTd.appendChild(document.createTextNode(`${s.BannerImageName}`))
        row.appendChild(bannerNameTd);

        const popupNameTd = document.createElement("td")
        popupNameTd.appendChild(document.createTextNode(`${s.PopupImageName}`))
        row.appendChild(popupNameTd);

        const bannerTd = document.createElement("td")
        const banner = document.createElement("img")
        banner.src = `${document.getElementById('bannerImageInput').files[0]?.name.split(".")[0] == s.BannerImageName ? URL.createObjectURL(document.getElementById('bannerImageInput').files[0]) : `https://raw.githubusercontent.com/planetarium/NineChronicles.LiveAssets/main/Assets/Images/Banner/${s.BannerImageName}.png`}`
        bannerTd.appendChild(banner)
        row.appendChild(bannerTd);

        const popupTd = document.createElement("td")
        const popup = document.createElement("img")
        popup.src = `${document.getElementById('popupImageInput').files[0]?.name.split(".")[0] == s.PopupImageName ? URL.createObjectURL(document.getElementById('bannerImageInput').files[0]) : `https://raw.githubusercontent.com/planetarium/NineChronicles.LiveAssets/main/Assets/Images/Notice/${s.PopupImageName}.png`}`
        popup.width = 300
        popup.height = 210
        popupTd.appendChild(popup)
        row.appendChild(popupTd);

        const beginDateTimeTd = document.createElement("td")
        beginDateTimeTd.appendChild(document.createTextNode(`${s.BeginDateTime}`))
        row.appendChild(beginDateTimeTd)

        const endDateTimeTd = document.createElement("td")
        endDateTimeTd.appendChild(document.createTextNode(`${s.EndDateTime}`))
        row.appendChild(endDateTimeTd)

        const urlTd = document.createElement("td")
        urlTd.appendChild(document.createTextNode(`${s.Url}`))
        row.appendChild(urlTd)

        const descriptionTd = document.createElement("td")
        descriptionTd.appendChild(document.createTextNode(`${s.Description}`))
        row.appendChild(descriptionTd)

        // add the row to the end of the table body
        tblBody.appendChild(row);
    });

    // put the <tbody> in the <table>
    tbl.appendChild(tblBody);
    tbl.setAttribute("border", "2");

    // appends <table> into <body>
    document.body.appendChild(tbl);
}

async function getJsonAndRender(){
    const response = await fetch('https://raw.githubusercontent.com/planetarium/NineChronicles.LiveAssets/main/Assets/Json/Event.json',
        {
            method: 'GET',
        });
    const json = await response.json();
    await renderTable(json.Banners)
    runtimeList.forEach(s => console.log(s))
}

function printJson(){
    if (runtimeList.length > 0) {
        const jsonList = new Object()
        jsonList.Banners = runtimeList
        console.log(JSON.stringify(jsonList, null, 4))
    }
}

async function gitCommitAndPush() {
    const inputToken = document.getElementById('githubToken').value
    if (inputToken == "") {
        alert("토큰없음")
        return 500;
    }

    const path = `Assets/Json/Event-test.json`
    const octokit = new Octokit({
        auth: document.getElementById('githubToken').value
    })
    const result = await octokit.repos.createOrUpdateFileContents({
        owner: "planetarium",
        repo: "NineChronicles.LiveAssets",
        path,
        message: `commit test"`,
        content: Base64.encode(document.getElementById('outputJson').textContent),
        
    })

    return result?.status || 500
}

document.getElementById('getJson').addEventListener('click', getJsonAndRender);
document.getElementById('printJson').addEventListener('click', printJson);
document.getElementById('generateButton').addEventListener('click', inputToRenderTable);
document.getElementById('commitButton').addEventListener('click', gitCommitAndPush);