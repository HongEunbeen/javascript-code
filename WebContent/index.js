window.onload = function() {
	handleRefresh();
	SelectSet();
	getMyLocation();
	fixDiv();
}

var SelectArea;
var SelectItem;
var latitude;
var longitude;


function handleRefresh() {
	console.log("here");
	var url = "http://openapi.seoul.go.kr:8088/614a774a437676763838445a646469/json/GeoInfoLibraryWGS/1/123/"
	$.getJSON(url, updateTraffic);
}

function getMyLocation(){//현재 위치를 불러오는 함수
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition (
			displayLocation,//성공시 displayLocation 함수로 실패시 displayError 함수가 호출된다.
			displayError);
	}else{
		alert("이 브라우저에서는 Geolocation이 지원되지 않습니다.");
	}
}
function displayLocation(position){        
	latitude = position.coords.latitude; // 위도
	longitude = position.coords.longitude; // 경도

	initMap(latitude, longitude);//
}

function initMap(latitude, longitude) {
	var googleLatAndLong = new google.maps.LatLng(latitude, longitude);
	var map = new google.maps.Map(document.getElementById('map'), {
		scaleControl: true,//map에서 마우스로 스크롤을 허용한다.
		center: googleLatAndLong,//현재 위치를 중심으로 load한다.
		zoom: 15,
		mapTypeId: google.maps.MapTypeId.ROADMAP
	});
	addLegend(map);//legned를 사용하기 위해 map을 매개변수로 보내준다.
}

function displayError(error){
	var errorTypes = {
		0 : "알려지지 않은 에러",
		1 : "사용자가 권한 거부",
		2 : "위치를 찾을 수 없음",
		3 : "요청 응답 시간 초과"
	};
	var errorMessage = errorTypes[error.code];
	alert(errorMessage);//error 메시지를 사용자에게 보여준다.
}

function addLegend(map){
	var legend = document.getElementById('legend');//legend div를 가져온다.
	var name = "도서관";
	var icon = 'http://maps.google.com/mapfiles/kml/pal2/icon10.png';
	var div = document.createElement('div');//legend 밑에 div를 추가해준다.
	div.innerHTML = '<img src="' + icon + '"> ' + name;//아이콘과 이름을 넣어준다.
	legend.appendChild(div);
	map.controls[google.maps.ControlPosition.LEFT_BOTTOM].push(legend);//map의 왼쪽 바닥에 legend를 위치 시킨다.
}


function updateTraffic(libraryLocation) {
    var libraryDiv = document.getElementById("libraryLocation");
    var traffic = libraryLocation.GeoInfoLibraryWGS.row;
    for (var i = 0; i < traffic.length; i++) {
        var div = document.createElement("div");
        div.setAttribute("class", "libraryitem");
				div.setAttribute("onclick", "libraryitem_click("+traffic[i].OBJECTID+");");
				div.innerHTML = " "
					+ traffic[i].FCLTY_NM + "<br>"
					+"주소 : " +traffic[i].NEADRES_NM;
				if (libraryDiv.childElementCount == 0) {
					libraryDiv.appendChild(div);
				} else {
					libraryDiv.insertBefore(div, libraryDiv.firstChild);
				}
		}
 }

 function selectTraffic(libraryLocation) {
	delectDiv();
	
	var libraryDiv = document.getElementById("libraryLocation");
	var traffic = libraryLocation.GeoInfoLibraryWGS.row;
	
	for (var i = 0; i < traffic.length; i++) {//호출한 traffic 만큼 for 문을 돌린다.
			console.log(SelectArea);
			console.log(traffic[i].GU_NM);
			
			if(SelectArea == traffic[i].GU_NM){//select로 선택한 지역이 traffic과 같은지 확인한다.
				var div = document.createElement("div");//아이템을 리스트에 추가하기 위한 div를 생성한다.
				div.setAttribute("class", "libraryitem");//css 적용과 onclick 적용을 위한 class 부여한다.
				div.setAttribute("onclick", "libraryitem_click("+traffic[i].OBJECTID+");");//클릭 했을 때의 이벤트 처리를 해준다.
				
				div.innerHTML = " "
					+ traffic[i].FCLTY_NM + "<br>"
					+"주소 : " +traffic[i].NEADRES_NM;//리스트에 보여진 이름과 주소 아이템을 div에 넣는다.
				
				if (libraryDiv.childElementCount == 0) {
					libraryDiv.appendChild(div);//libraryDiv에 생성한 아이템div를 연결한다.(값이 없을때)
				} else {
					libraryDiv.insertBefore(div, libraryDiv.firstChild);//libraryDiv 처음에 존재하는 div에 생성한 아이템div를 연결한다.(값 존재시)
				}
				
			}else if(SelectArea == "전체"){//지역을 선택하지 않고 전체를 선택했다면 전체 traffic을 불러온다.
				
				var div = document.createElement("div");
				div.setAttribute("class", "libraryitem");
				div.setAttribute("onclick", "libraryitem_click("+traffic[i].OBJECTID+");");
				
				div.innerHTML = " "
					+ traffic[i].FCLTY_NM + "<br>"
					+"주소 : " +traffic[i].NEADRES_NM;
				
				if (libraryDiv.childElementCount == 0) {
					libraryDiv.appendChild(div);
				} else {
					libraryDiv.insertBefore(div, libraryDiv.firstChild);
				}
			}
			
	}
}
//select 태그에 options을 추가하기 위해 배열을 선언해 for문을 통해 값을 하나씩 넣는다.
 function SelectSet(){
	var target = document.getElementById("selectBox");
	var area = ["강남구","강동구","강북구","강서구","관악구","광진구","구로구","금천구","노원구","도봉구","동대문구","동작구","마포구","서대문구","서초구","성동구","성북구","송파구","양천구","영등포구","용산구","은평구","종로구","중구","중랑구"];
	for(i = 1; i < area.length; i++){
		target.options[i] = new Option(area[i]);
	}
}
 //select를 사용자가 선택 했을 때 오픈DATA에서 가져오는 값을 한정하기 위해 다시 traffic을 가져온다.
 function SelectChange(){
		var target = document.getElementById("selectBox");
		SelectArea = target.options[target.selectedIndex].value;
		console.log(SelectArea);
		var url = "http://openapi.seoul.go.kr:8088/614a774a437676763838445a646469/json/GeoInfoLibraryWGS/1/123/"
		$.getJSON(url, selectTraffic);
 }
 //사용자가 select를 선택했을 시 list를 비워주고 다시 갱신하기 위해서 empty 함수를 사용해 비워준다.
 function delectDiv(){
	$(document).ready(function() {
		$("#libraryLocation").empty();
	});
 }
 
 function libraryitem_click(ObjectID){
	SelectItem = ObjectID;
	var url = "http://openapi.seoul.go.kr:8088/614a774a437676763838445a646469/json/GeoInfoLibraryWGS/1/123/"
	$.getJSON(url, selectItem);
 }
 //선택된 아이템의 정보를 확인하기 위한 작업을 합니다
 function selectItem(libraryLocation) {
	var traffic = libraryLocation.GeoInfoLibraryWGS.row;
	for (var i = 0; i < traffic.length; i++) {
		if(SelectItem == traffic[i].OBJECTID){
			var CheckMap = confirm(
			"주소 : " +traffic[i].NEADRES_NM + "\n"
			+"홈페이지 주소 : https://"+ traffic[i].HMPG_CN + "\n"
			+"전화번호 : " + traffic[i].CTTPC_CN + "\n"
			+"지도로 보시겠습니까?");
			if(CheckMap){//confirm 의 확인 버튼을 클릭시 mark가 찍히도록 선택된 traffic의 위도와 경도 이름을 매개변수로 보내준다.
				createMark(traffic[i].LNG, traffic[i].LAT, traffic[i].FCLTY_NM, traffic[i].HMPG_CN);
			}
		}
	}
}
 
function createMark(log, lat, name, page){
	longitude = log;
	latitude = lat;
	var myMarker = new google.maps.LatLng(lat, log);//선택된 도서관의 위도와 경도를 이용해서 위치를 생성한다.
	var map = new google.maps.Map(document.getElementById('map'), {
		scaleControl: true,
		center: new google.maps.LatLng(lat, log),//좌표를 map에 추가한다.
		zoom: 15
	});
	console.log(lat + "   " + log);
	addMarker(map, myMarker, name, page);//mark를 찍기 위해 함수를 호출한다.
}

function addMarker(map, latlong, title, page) {
	var markerOptions = {
		position: latlong,//위치 좌표를 중심으로 지도가 보여진다.
		map: map,
		title: title,
		clickable: true//mark를 클릭 할 수 있도록 허용한다.
	};
	var iconBase = 'http://maps.google.com/mapfiles/kml/pal2/';
	var marker = new google.maps.Marker({
			position: latlong,
			map: map,
			icon: iconBase + 'icon10.png'
		});//mark를 생성해서 표시한다.

	var infoWindowOptions = {
		content: createInfoWindowContent(title, latlong, page),//mark 클릭 시 설명 창을 띄우기 위한 함수를 호출한다.
		position: new google.maps.LatLng(latitude, longitude)
	};

	var infoWindow = new google.maps.InfoWindow(infoWindowOptions);
	google.maps.event.addListener(marker, 'click', function() {//mark를 click 했을 때의 이벤트를 달아준다.
		infoWindow.open(map);
	});
}

function createInfoWindowContent(title, latlong, page) {
	return [
		'<div>도서관 이름 : ' + title + '<br>'
		+'위도, 경도 : ' + latlong +
		'<br>홈페이지 주소 : <a href = "' + page + '" target = "_self">'
		+'https://'+ page +'</a>' + '</div>'//위도와 경도를 표시해준다.
	].join('<br>');
}
