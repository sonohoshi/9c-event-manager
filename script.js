import { Octokit } from "https://esm.sh/@octokit/rest";

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
        Description: description,
        EnableKeys: []
    };
    runtimeList.push(jsonOutput)

    const bannerImage = document.getElementById('bannerImageInput').files[0]
    const bannerReader = new FileReader()
    bannerReader.readAsDataURL(bannerImage)
    bannerReader.onload = () => {
        const res = bannerReader.result.replace(`data:image/png;base64,`,'')
        addImages.push({path: `Assets/Images/Banner/${bannerImageName}.png`, file: res})
        addImages.push({path: `Assets/Images/Banner/${bannerImageName}_KR.png`, file: res})
        addImages.push({path: `Assets/Images/Banner/${bannerImageName}_JP.png`, file: res})    
    }
    const popupImage = document.getElementById('popupImageInput').files[0]
    const popupReader = new FileReader()
    popupReader.readAsDataURL(popupImage)
    popupReader.onload = () => {
        const res = popupReader.result.replace(`data:image/png;base64,`,'')
        addImages.push({path: `Assets/Images/Notice/${popupImageName}.png`, file: res})
        addImages.push({path: `Assets/Images/Notice/${popupImageName}_KR.png`, file: res})
        addImages.push({path: `Assets/Images/Notice/${popupImageName}_JP.png`, file: res})    
    }
    renderTable(runtimeList)
}

// Event JSON Modifier
// ... (Event JSON Modifier JavaScript 코드를 여기에 추가) ...
var runtimeList = Array();
var addImages = Array();
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
    tdElement.appendChild(document.createTextNode("우선순위"))
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

        const priorityTd = document.createElement("td")
        priorityTd.appendChild(document.createTextNode(`${s.Priority}`))
        row.appendChild(priorityTd);

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
        popup.src = `${document.getElementById('popupImageInput').files[0]?.name.split(".")[0] == s.PopupImageName ? URL.createObjectURL(document.getElementById('popupImageInput').files[0]) : `https://raw.githubusercontent.com/planetarium/NineChronicles.LiveAssets/main/Assets/Images/Notice/${s.PopupImageName}.png`}`
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
    const realJson = new Object()
    realJson.Banners = serializedList
    document.getElementById('outputJson').textContent = JSON.stringify(realJson, null, 4);
}

async function getJsonAndRender(){
    const response = await fetch('https://raw.githubusercontent.com/planetarium/NineChronicles.LiveAssets/main/Assets/Json/Event.json',
        {
            method: 'GET',
        });
    const json = await response.json();
    renderTable(json.Banners)
    addImages = Array();
    runtimeList.forEach(s => console.log(s))
}

async function makeTreeAndPush(octokit, files){
    const owner = "planetarium"
    const repo = "NineChronicles.LiveAssets"
    let response;
    response = await octokit.repos.listCommits({
        owner,
        repo,
        sha: "main",
        per_page: 1
    })
    let latestCommitSha = response.data[0].sha

    const ImageBlobs = new Object()
    for (const image of addImages){
        const { data: { sha: newBlobHash } } = await octokit.git.createBlob({
            owner, repo, content: image.file, encoding: "base64"
        });
        ImageBlobs[image.path] = newBlobHash;
        console.log(newBlobHash);
    }
    const changes = { files: ImageBlobs }
    console.log(changes)
    const newTree = Object.keys(changes.files).map(path => {
        const mode = "100644"
        return {
          path,
          mode,
          sha: changes.files[path]
        }
      })
    console.log(newTree)
    newTree.push({path: "Assets/Json/Event.json", mode: "100644", content: files["Assets/Json/Event.json"]})
    response = await octokit.git.createTree({
        owner,
        repo,
        base_tree: latestCommitSha,
        tree: newTree
    })
    const newTreeSha = response.data.sha

    response = await octokit.git.createCommit({
        owner,
        repo,
        message: "update event data",
        tree: newTreeSha,
        parents: [latestCommitSha]
    })
    latestCommitSha = response.data.sha
    return await octokit.git.updateRef({
        owner,
        repo,
        sha: latestCommitSha,
        ref: `heads/main`,
        force: true
    })
}

async function gitCommitAndPush() {
    if (typeof browser === "undefined") {
        var browser = chrome;
    }

    const inputToken = document.getElementById('githubToken').value

    const octokit = new Octokit({
        auth: inputToken
    })
    await octokit.request("/user")
        .then(_ => {
            const content = document.getElementById('outputJson').textContent;
            if(content == ""){
                throw "업로드 할 데이터가 없습니다"
            }

            return content
        })
        .then(async content => {
            const preparedJson = new Object()
            preparedJson["Assets/Json/Event.json"] = content
            return await makeTreeAndPush(octokit, preparedJson)
        })
        .then(res => alert(res?.status == 200 ? "업로드 되었습니다." : res?.status))
        .catch(err => alert(`뭔가잘못됨, ${err}`))
}

document.getElementById('getJson').addEventListener('click', getJsonAndRender);
document.getElementById('inputForm').addEventListener('submit', function(event){
    inputToRenderTable();
    event.preventDefault();
});
document.getElementById('gitForm').addEventListener('submit', function(event){
    gitCommitAndPush();
    event.preventDefault();
});