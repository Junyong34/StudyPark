var SubMission = ( function () 
{
    function SubMission(form, urlx, input, output,  msghandler, menuid, eventid)
    {
    this.form = form;
    this.url = urlx;
    this.menuid = menuid;
    this.eventid = eventid;
    this.input = input;
    this.output = output; 
    this.msghandler = msghandler;
    this.required=false;
    this.confirmyn=false;
    this.confirmmsg ="";
    this.ExcelFileName ="ExcelReport.xlsx";
    this.excludeColumn=[];
    }
    function AjaxFileUpload(form, urlx)
    {
    this.form = form;
    this.url = urlx;
    }
    SubMission.prototype.getForm = function ()
    {
       return this.form;
    }
    SubMission.prototype.getUrl = function ()
    {
       return this.url;
    }
    SubMission.prototype.getRequired = function ()
    {
       return this.required;
    }
    SubMission.prototype.getMenuid = function ()
    {
       return this.menuid;
    }
    SubMission.prototype.getEventid = function ()
    {
       return this.eventid;
    }
    SubMission.prototype.getInput = function ()
    {
       return this.input;
    }
    SubMission.prototype.getOutput = function ()
    {
       return this.output;
    }
    SubMission.prototype.getInputList = function ()
    {
      return this.input.split(",");
    }
    SubMission.prototype.getOutputList = function ()
    {
      return this.output.split(",");
    }
    SubMission.prototype.getExcelName = function ()
    {
      return this.ExcelFileName;
    }
    SubMission.prototype.getexcludeColumn = function ()
    {
      return this.excludeColumn;
    }

    // -- [set method]
    SubMission.prototype.setForm = function (formx)
    {
       this.form = formx;
    }
    SubMission.prototype.setUrl = function (urlx)
    {
       this.url = urlx;
    }
    SubMission.prototype.setConfirmMsg = function (msg)
    {
       this.confirmyn=true;
       this.confirmmsg =msg;       
    }
    SubMission.prototype.setexcludeColumn = function (excolnm)
    {
       this.excludeColumn =excolnm;       
    }
    SubMission.prototype.setExcelName = function (excelname)
    {
       this.ExcelFileName =excelname;       
    }
    SubMission.prototype.setConfirmYN = function (yn)
    {
       this.confirmyn=yn;  
    }
    SubMission.prototype.setRequired = function (requiredx)
    {
       this.required = requiredx;
    }
    SubMission.prototype.setMenuid = function (menuidx)
    {
       this.menuid = menuidx;
    }
    SubMission.prototype.setEventid = function (eventidx)
    {
       this.eventid = eventidx;
    }
    SubMission.prototype.setInput = function (inputx)
    {
       this.input = inputx;
    }
    SubMission.prototype.setOutput = function (outputx)
    {
       this.output = outputx;
    }
    SubMission.prototype.diplayInfo = function ()
    {
       alert("URL:"+this.url +"\n" + 
       "MENUID:"+this.menuid +"\n"+ 
       "EVENTID:"+this.eventid +"\n"+ 
       "INPUT:"+this.input +"\n"+ 
       "OUTPUT:"+this.output +"\n"
       );
    }
    // ----------------------------------------------------------------------------
    // "GRID_DEPTCD":"2009:2009; 2010:2010"
    SubMission.prototype.InitCombo = function (cbonames)
    {
      var itemstr=""; 
      // if(cbonames.indexOf(",") == -1) return;
    if(cbonames == "") return;
      var cbolist = cbonames.split(",");
      // alert(cbolist.length +":" + cbonames);
      var items;
      var option;
      for(var i=0; i<cbolist.length; i++)
      {
        $("#"+cbolist[i]).html("");
        itemstr = InitItems[cbolist[i]];
        // alert(itemstr.length);
    // if(cbonames.indexOf(",") == -1) return;
        items = itemstr.split(";");
        for(var ic= 0; ic<items.length; ic++)
        {
          option = items[ic].split(":");
          $("#"+cbolist[i]).append("<option value='" + option[0] + "'>"+option[1]+"</option>");
        }
      }
    }
    SubMission.prototype.submit = function (debug, callback,async)
    { 
      var first = true;
      var arrSet = this.getInputList();
      var wizgridnm;
      var tmpset;
      var ibsheetnm;
      var datasetnm;
      var ibsoption = "A";
      var isExistDelim = "";
      var param="";
      if(this.url == null || this.url == "")   return;
      
     // if( (this.input == null || this.input == "") && (this.output == null
    // || this.output == "")) { return;}
      param += '{ "paramwizware":[' 
       
      for(var i=0; i<arrSet.length; i++)
      {
     
        if(arrSet[i].indexOf(":") != -1)
        {
          tmpset = arrSet[i].split(":") ;
          uicontrolnm = tmpset[0];
          datasetnm = tmpset[1];
          wizgridnm= uicontrolnm;         
         
          if((ibsoption = wizutil.getOptions(uicontrolnm)) !="" )
          { 
            uicontrolnm = uicontrolnm.substring(0, uicontrolnm.indexOf("["));
            if( $('#'+uicontrolnm) != null &&  $('#'+uicontrolnm).attr('elType')=='Grid' )
            {
              param += isExistDelim + wizutil.DatasetQueryJson(uicontrolnm, datasetnm, ibsoption, debug);
            }
            else  if( $('#'+uicontrolnm) != null &&  $('#'+uicontrolnm).attr('elType')=='Tree' )
            {
              // --- Tree Data 필요시. 현재는 ReadOnly Tree : 이후 update-Tree 변경시 수정
              // 부분 수정
            }
            else
            {
                
              singleparm = wizutil.getSingleQueryJson(this.form, uicontrolnm, datasetnm, debug, this.required)
              if(singleparm == null) return;
              
             
              
              param +=  singleparm+",";
        
            }
          }
          else
          {
            param += isExistDelim + wizutil.DatasetQueryJson(uicontrolnm , datasetnm,"A",debug);
          }
          
          // isExistDelim ="&";
         }
      }
      param += '] }'
     if(this.confirmyn)
              {
                  if(confirm(this.confirmmsg)==false)
                  {
                    return;
                  }
              }

      wizutil.AjaxSubmit(this.url, param, this.output, callback, this.msghandler, debug,async);
    }
    SubMission.prototype.gridExcel = function (debug, callback)
    { 
      var first = true;
      var arrSet = this.getInputList();
      var wizgridnm;
      var tmpset;
      var ibsheetnm;
      var datasetnm;
      var ibsoption = "A";
      var isExistDelim = "";
      var param="";
      if(this.url == null || this.url == "")   return;
      
    
          if(ibsoption  !="" )
          { 
           
          
            if( $('#'+arrSet) != null &&  $('#'+arrSet).attr('elType')=='Grid' )
            {
        

              param += isExistDelim + wizutil.DatasetExcelString(arrSet, "S1000", ibsoption,  this.ExcelFileName,this.excludeColumn ,debug); // excel
                                                              // pjy
            }
        
          }
          else
          {
           alert("엑셀 다운 할 수 있는 그리드가 없습니다. !!");
           return;
          }
          
     
     if(this.confirmyn)
              {
                  if(confirm(this.confirmmsg)==false)
                  {
                    return;
                  }
              }
     wizutil.AjaxExcelSubmit(this.url, param, this.output,callback, this.msghandler, debug);
    }
    return SubMission;
}());
// form sumbit
function FormSubmit(formnm, url, inputdata, target, debug) {
  var formId = $('#' + formnm);
  var arrSet = inputdata.split(",");
  var wizgridnm;
  var tmpset;
  var ibsheetnm;
  var datasetnm;
  var ibsoption = "A";
  var isExistDelim = "";
  var param = "";
  // if(this.url == null || this.url == "") return;

  // if( (this.input == null || this.input == "") && (this.output == null
  // || this.output == "")) { return;}
  param += '{ "paramwizware":['
  for (var i = 0; i < arrSet.length; i++) {

    if (arrSet[i].indexOf(":") != -1) {
      tmpset = arrSet[i].split(":");
      uicontrolnm = tmpset[0];
      datasetnm = tmpset[1];
      wizgridnm = uicontrolnm;
      // alert(uicontrolnm + " @@ " + datasetnm + " # " + wizgridnm);
      if ((ibsoption = wizutil.getOptions(uicontrolnm)) != "") {
        uicontrolnm = uicontrolnm.substring(0, uicontrolnm.indexOf("["));
        if ($('#' + uicontrolnm) != null && $('#' + uicontrolnm).attr('elType') == 'Grid') {
          //param += isExistDelim + wizutil.DatasetQueryString(uicontrolnm, datasetnm, ibsoption, debug);
          param += isExistDelim + wizutil.DatasetQueryJson(uicontrolnm, datasetnm, ibsoption, debug);
        }
        else if ($('#' + uicontrolnm) != null && $('#' + uicontrolnm).attr('elType') == 'Tree') {
          // --- Tree Data 필요시. 현재는 ReadOnly Tree : 이후 update-Tree 변경시 수정
          // 부분
        }
        else {

          // singleparm = wizutil.getSingleQueryString(formId, uicontrolnm, datasetnm, debug, true);
          singleparm = wizutil.getSingleQueryJson(formId, uicontrolnm, datasetnm, debug, true)
          if (singleparm == null) return;



          param += singleparm + ",";

        }
      }
      else {
        param += isExistDelim + wizutil.DatasetQueryString(uicontrolnm, datasetnm, "A", debug);
      }
    }
  }
  param += '] }';
 // alert(param);
  $('#InWIzJsonParma').val(param);


  action.submit(formnm, url, target);
  // alert(frm+ " type " + typeof frm + " @@ " + "frm" + " @@ " + typeof
  // this.form);




}

 var action = 
  {
      submit:function submit(formId, action,target) 
      {
     
        if(formId=="") 
        {
          jQuery('form').each(function() 
          {
            formId = this.id;
          });
        }

        jQuery("#" + formId).attr("method", "POST");
        jQuery("#" + formId).attr("action", action);
        jQuery("#" + formId).attr("target", target);
        jQuery("#" + formId).submit();
      }
      ,
      submitGet:function submit(formId, urlx) 
      {
        if(formId=="") 
        {
          jQuery('form').each(function() 
          {
            formId = this.id;
          });
        }
        jQuery("#" + formId).attr("action", urlx);
        jQuery("#" + formId).submit();
      }
      ,
      openWindow:function openWindow(theURL, param, winName, features) 
      {
       // url 팝업화면 주소
       // input 인풋 데이타
       // winName 팝업창 이름
       // features 팝업창 옵션 정보
    // width=1100,height=700,scrollbars=yes,resize=no,toolbars=no
      if(param == ''){
         window.open(Contextpath + theURL,winName,features);
      }else{
        
      if(theURL.substring(0,1) != "/"){
        theURL = "/" + theURL;
      }
       
        var urls = Contextpath + theURL +'?' + param ;  
     // alert( urls + " , " + winName + " , " + features);
         window.open(urls,winName,features);
      }
       
      }
  }
  
// ================================ Menu 처리 기능 추가 Start : 2015.11.06// =======================================
// =================================================================================================================
var tabMenuInfox = [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1];   // 현재 10개 , 수정시 jsp에서
                            // div 개수변경처리 필요.
var currentMenunumberx=0;
var menutimerx;
var menustatusx = 1;
var currentmenuid="",currentparentid="";
var wizmenu = 
{
  addMenuTab:function addMenuTabPag(menuTitle, loadUrl, menuid, parentid)
  {
    // loadUrl = "http://www.daum.net";
    // menuTitle ="사원등록";

  
    var i=0, finded=false;

    for(i=0;i<tabMenuInfox.length;i++)
    {
      
      if(tabMenuInfox[i] == -1)
      {
       
        finded = true;
        break;
      }
    }
    if(finded==false)
    {
     
     // alert("MenuTab은 최대 10개 까지 가능합니다.");
      return;
    }
    
   
  
    
    var tabelement = '<li id="tab'+i+'"  id="rel'+i+'" onclick="javascript:tabClick(this)" ondblclick ="javascript:tabDbClick(this,\''+loadUrl+'\' )" >'+menuTitle+'  <img  onclick="javascript:tabrefresh(this,\''+loadUrl+'\')" style="width:14px;height:11px;" src="/hpms/wizware/css/img/menu/refresh.png" alt="재조회" />'+'</li>';
    var indextab = i -1;
    // if(i == 0){
       $("#tabmenu").append(tabelement);
   /*
   * }else{ $("#tab"+indextab).before(tabelement); /}
   */
    /*
   * <ul class="tabs"> <li rel="tab1">공지사항1111111</li>
   */
     if(menuid != undefined)
    {
      $("#tab"+i).attr("menuid", menuid);
     }
    if(parentid != undefined)
    {
      $("#tab"+i).attr("parentid", parentid);
    } 

     
    tabMenuInfox[i] = i;
    var label = $('#tab'+i);

    /*
   * $('#tab'+i).click(function() {
   * 
   * menustatusx = 1; menutimerx = setTimeout( function() { if( menustatusx==
   * 1) { wizmenu.loadPage($('#tab'+i),i); } }, 250); });
   * $('#tab'+i).dblclick(function() {
   * 
   * wizmenu.removeTabMenuPage($('#tab'+i),i); });
   */

    this.initPageMenu(i, loadUrl);

    this.selectTabPage(i);
  }
  ,
  initPageMenu:function initPageMenu(num, url)
  {
  
    for(var i=0;i<tabMenuInfox.length;i++)
    {
      this.diplay(i,false);
    }
    this.diplay(num,true);
    currentMenunumberx = num;
   
    var piframe = document.getElementById('menu' + num);
    $("#menu"+num).attr('src',url);
    
  }
  ,
  loadPage:function loadPage(obj,index)
  {
    
     // alert( "선택된 텝 인덱스 " + index);
    var pageNum = index;    
    if(obj.attr("menuid") != undefined) currentmenuid=obj.attr("menuid");
    if(obj.attr("parentid") != undefined) currentparentid=obj.attr("parentid");
    for(var i=0;i<tabMenuInfox.length;i++)
    {
      this.diplay(i,false);
    }
     this.diplay(pageNum,true);
    currentMenunumberx = pageNum;
    this.selectTabPage(currentMenunumberx);
  }
  ,
  removeTabMenuPage:function removeTabMenuPage(obj,index)
  {
    // alert( " 해당 인덱스 삭제 "+index);
   // clearTimeout(menutimerx);
    
    menustatusx = 0;
    var pageNum = index;
    var middleChk = false;
    
    obj.remove();
    var tabmenuCnt = $('#tabmenu li').length-1;
    // tabMenuInfox[pageNum] = -1;
    
    this.clearPage(pageNum);
    var nextNum = this.getNextPage(pageNum);
    if(pageNum !=0){
    this.diplay(pageNum-1,true);
    this.selectTabPage(pageNum-1);

    }else{
    this.diplay(pageNum,true);
    this.selectTabPage(pageNum);

    }
   
     $.each(tabMenuInfox,function(index,item){
         
            if(index !=9){
            
             if(pageNum <= index && item != -1){
          
              $("#tab"+Number(index+1)).attr('id','tab'+(Number(index)));
              if(pageNum <= index ){ 
                  // alert("inext " + index + " 이동전 " +
          // $('#menu'+Number(index-1)).attr('src') + "변경 후 " +
          // $('#menu'+Number(index)).attr('src') );
                 $('#menu'+Number(index)).attr('src',$('#menu'+Number(index+1)).attr('src'));
             }
            }
          
           }
           
    });
      $.each(tabMenuInfox,function(index,item){
             if(item != -1 && index != 9 && pageNum <= index && pageNum != 0)
             {
               // alert(index);
               tabMenuInfox[index] =index;
               
             }
             if(tabmenuCnt <index){
             // alert( tabmenuCnt + " @ @ " +index);
              tabMenuInfox[index] =-1;
             }

        });    

           // 텝 하나일때 텝 삭제하면 iframe 하이드 처리
    if($('#tabmenu li:eq(0)').attr('id') == undefined){
    $.each(tabMenuInfox,function(index,item){
       tabMenuInfox[index] =-1;

   });    
        $('#tabPage0').css('display','none');
    }
       
      

  }
  ,
  clearPage:function clearPage(num)
  {
    if( num == currentMenunumberx)
    {
      this.diplay(num, false);
    }
    else
    {
      this.diplay(num, false);
    }
  }
  ,
  getNextPage:function getNextPage(num)
  {
    var idx = -1;
    for(var i=num;i>=0;i--)
    {
      if(tabMenuInfox[i] != -1)
      {
        idx = i;
        break;
      }
    }
    if(idx==-1)
    {
      for(var i=num;i<tabMenuInfox.length;i++)
      {
        if(tabMenuInfox[i] != -1)
        {
          idx = i;
          break;
        }
      }
    }

    return idx;
  }
  ,
  selectTabPage:function selectTabPage(selectedIndex)
  {
    // alert(selectedIndex);
    selectedIndex++;
    var elementid="";
    var objtr = document.getElementById("tabmenu");
    if(objtr.hasChildNodes()==false) return "";
   
    var tmp="";
    
    for(var i=1;i<objtr.childNodes.length;i++)
    {
      elementid = objtr.childNodes[i].id;
      
      if(selectedIndex == i)
      {
        
        jQuery("#"+elementid).addClass('collor-Select');
        jQuery("#"+elementid).removeClass('collor-NoSelect');
      }
      else
      {
       jQuery("#"+elementid).removeClass('collor-Select');
       jQuery("#"+elementid).addClass('collor-NoSelect');
      }
    }
  }
  ,
  diplay:function diplay(num, displayYN)
  {
    var divid = "tabPage" + num;
   
   // var objDiv = document.getElementById(divid);
    var objdiv = $("#"+divid);
    if(displayYN ==false)
    { 
      // objDiv.style.display = "none";
      objdiv.css('display','none');
      // 10개 초과시 디폴트 아이프레임 숨기기
      $("#tabPage_Default").css('display','none');
    }
    else
    { 
      objdiv.css('display','block');
      // objDiv.style.display = "block";
    }
  }
  ,
  displayInfo:function displayInfo()
  {
    var tmp ="";
    for(i=0;i<tabMenuInfox.length;i++)
    {
      tmp += tabMenuInfox[i] +":";
    }
    
    return tmp;
  }
  ,
  diplayMainTreeMenu:function diplayMainTreeMenu(menudiv, displayYN)
  {
      var objDiv = document.getElementById(menudiv);
      if(displayYN == undefined)
      {
        if(objDiv.style.display =="none")
        { 
          objDiv.style.display = "block"; 
        }
        else
        { 
          objDiv.style.display = "none"; 
        }
      }
      else
      {
        if(displayYN ==false)
        { 
          objDiv.style.display = "none"; 
        }
        else
        { 
          objDiv.style.display = "block"; 
        }
      }
  }
  
};
// =================================================================================================================
// ================================ Menu 처리 기능 추가 End : 2015.11.06
// ======================================
// =================================================================================================================




// IUDFLAG 체크
var wizutil = 
{
  wizFiledownload:function wizFiledownload(filepath, filename,fileUnName,downloadjsp){
    var url;
    
    if(downloadjsp == "" || downloadjsp == undefined){
       url = Contextpath+'/jsp/File/download.jsp?';
      
      
    }else{
      
      url =Contextpath+downloadjsp+"?"
    }
    // alert( url + " @ " + filepath + " @ " + filename + " @ "+ fileUnName + "
  // @ " + downloadjsp);
    
    var win = window.open( url+"filename="+fileUnName+"&filepath="+filepath+"&rfilename="+filename, "FileDownload", "width=1,height=1");

  }
,
  wizgrid_allchk:function wizgrid_allchk( gridid , btnid)// 그리드 칼럼 전체 체크박스
  {
     if(($("#"+btnid).prop("checked"))){
      // 전체 체크
      // $(".grid1_chk").prop("checked",true);
      $("."+gridid+"_chk").prop('checked', true).attr('checked',true).trigger('change');             
        
   }else{
         // 전체 체크 해지
      $("."+gridid+"_chk").prop('checked', false).attr('checked',false).trigger('change');        
         }   
   
  },
  wizgrid_Colheight:function wizgrid_Colheight( gridid,colname , height)// 그리드
                                    // 높이 변경
  {
   $('#'+gridid+'_'+colname).css('height',height+'px');
   
  },
  setMake:function setMake( filed , filedId , top ,left , classNm)// 필드 이름
                                  // (input) ,
                                  // ID 정보 ,
                                  // top 정보,
                                  // left 정보 ,
                                  // 클래스 이름)
  {
   
   this.filed = filed;
   this.filedId = filedId;
   this.top = top;
   this.left = left;
   this.classNm = classNm;
    $('#pbview').append("<"+filed+" type='hidden' style='position:absolute; top:"+top+"px; left:"+left+"px;' id='"+filedId+"' name='"+filedId+"' calss='"+classNm+"'></"+filed+"> " );
  // makeInput(this.filed , this.filedId ,this.top ,this.left , this.classNm);
  // alert(filed + " @ "+ filedId + " # " + top + " # " + left + " $ " +
  // classNm );
  },
  DialogPopup:function DialogPopup(url , Parameter , iframeId , divId , Dialogtitle, DialogHeight,DialogWidth )
{
    
    if(url.substring(0,1) != "/"){
      url = "/" + url;
      
    }
    var urls = Contextpath + url +'?' + Parameter ; 
    
    $("#" +iframeId).attr("src", urls);  
    $("#" +iframeId).attr("frameborder", 0);  
    $("#" +iframeId).css("height", (DialogHeight - 70));  
    $("#" +iframeId).css("width", (DialogWidth - 40));  
    $("#" + divId).dialog({  
    autoOpen: false,  
    height: DialogHeight,  
    width: DialogWidth, 
    modal: true,  
    title: Dialogtitle, 
    resizable: true,  
    closeOnEscape: true,    
    create: function(event, ui){  
    },  
    open: function(event, ui){  
    },  
    close: function(){ 
    // iframe 초기화.
      $("#" +iframeId).html('') ;
    },  
    cancel: function(){  
    }  
    });  
    
    $("#" + divId).dialog("open"); 
    
     
  },
   FindStatusRows:function FindStatusRows(statusType , gridid)
   {
    var GridObj=$('#'+gridid);
    var gridcnt = GridObj.getDataIDs();

    var rowcnt = gridcnt.length;
    var flaglist ="";
    for(var i = 0; i < rowcnt; i++)
    {
      if(statusType == "A")   // 전체 Row
      {
        flaglist += gridcnt[i] +",";
        continue;
      }
      
      if(statusType == "C")  // 변경 Row
      {
        if( GridObj.getCell( gridcnt[i] ,'IUDFLAG')== 'I' || GridObj.getCell( gridcnt[i] ,'IUDFLAG')=='U'  ||GridObj.getCell( gridcnt[i] ,'IUDFLAG')== 'D')
        {
          flaglist += gridcnt[i] +",";
        }
        continue;
      }
      
      if( GridObj.getCell( gridcnt[i] ,'IUDFLAG')== statusType)   // I|U|D
                                  // statusType에
                                  // 해당되는 것만
      {
        flaglist += gridcnt[i] +",";
      }
    }
    return flaglist;
  }
  ,
  FormQueryString:function FormQueryString(form)
  {
  
    if(typeof form == "object" && form.tagName == "FORM"){
      A_FORM = form;// 파일업로드가 없는경우
    }else{
      A_FORM = form[0];// 파일업로드가 있는경우
    }
    
    var name = new Array(A_FORM.elements.length);
    var value = new Array(A_FORM.elements.length);
    var j = 0;
    var plain_text="";
    
    len = A_FORM.elements.length;
    for ( i= 0 ; i< len; i++){
      switch(A_FORM.elements[i].type){
        case "button":
        case "reset":
        case "submit":
        case "":
        break ;
        case "radio":
        case "checkbox":
              if(A_FORM.elements[i].checked == true){
                name[j]  = A_FORM.elements[i].name;
                value[j] =A_FORM.elements[i].value;
                j++
                
              }
              break;
        case "select-one":
            name[j] = A_FORM.elements[i].name;
            var ind = A_FORM.elements[i].selectedIndex;
            if(ind >=0){
              if(A_FORM.elements[i].options[ind].value != '')
                value[j] = A_FORM.elements[i].options[ind].value;
              else
                value[j] = A_FORM.elements[i].options[ind].text;
            }else {
              value[j] = "";
            }
            j++;
            break;
        case "select-multiple":
            name[j] = A_FORM.elements[i].name;
            var llen = A_FORM.elements[i].length;
            var increased = 0;
            for (k = 0; k< llen; k++){
              if(A_FORM.elements[i].options[k].selected){
                name[j] = A_FORM.elements[i].name;
                
                    if (A_FORM.elements[i].options[k].value !='')
                      value[j] = A_FORM.elements[i].options[k].value; 
                    else
                      value[j] = A_FORM.elements[i].options[k].text;
                    j++;
                    increased++;                
                }
            }
              if(increased > 0) {
                j--;
              }else {
              value[j] = "";
              }
              j++;
              break;
              default :
              name[j] = A_FORM.elements[i].name; 
              value[j] = A_FORM.elements[i].value;
              j++;

            }
      
      }
      var cboCode;
      for (i = 0; i < j; i++)
      {
        if(name[i].lastIndexOf("_") != -1)
        {
          cboCode = name[i].substring(name[i].lastIndexOf("_"));
          if(cboCode == "_text")
          {
            continue;
            
          }
          else if(cboCode == "_code")
          {
            name[i] = name[i].substring(0,name[i].lastlndexOf("_"));
          }
        }
        if(i==0)
        {
          if(name[i] != '') plain_text += name[i]+"="+ value[i];
        }
        else{
          if(name[i] != '') plain_text += "&"+name[i]+"="+ value[i];
        }
        
      }
    return plain_text;
  }
  ,
   getSingleQueryString:function FormQueryString(form, uiprefix, sndname, debug, reqYn)      // ----
                                                // kjs
  {
    
    if(typeof form == "object" && form.tagName == "FORM")
    {
      A_FORM = form;   // 파일업로드가 없는경우
    }else{
     
      A_FORM = form[0];// 파일업로드가 있는경우
    }

    var name = new Array(A_FORM.elements.length);
    var value = new Array(A_FORM.elements.length);
    var j = 0;
    var plain_text="";
    len = A_FORM.elements.length;
    for ( i= 0 ; i< len; i++)
    {
 
      switch(A_FORM.elements[i].type)
      {

        case "button":
        case "reset":
        case "submit":
        case "":
        break ;
        case "radio":
        case "checkbox":
              if(A_FORM.elements[i].checked == true)
              {
                name[j]  = A_FORM.elements[i].name;
                value[j] =A_FORM.elements[i].value;
                j++
              }
              break;
        case "select-one":
            name[j] = A_FORM.elements[i].name;
            var ind = A_FORM.elements[i].selectedIndex;
            if(ind >=0){
              if(A_FORM.elements[i].options[ind].value != '')
                value[j] = A_FORM.elements[i].options[ind].value;
              else
                value[j] = A_FORM.elements[i].options[ind].text;
            }else {
              value[j] = "";
            }
            j++;
            break;
        case "select-multiple":
            name[j] = A_FORM.elements[i].name;
            var llen = A_FORM.elements[i].length;
            var increased = 0;
            for (k = 0; k< llen; k++)
            {
              if(A_FORM.elements[i].options[k].selected)
              {
                name[j] = A_FORM.elements[i].name;
                if (A_FORM.elements[i].options[k].value !='')
                  value[j] = A_FORM.elements[i].options[k].value; 
                else
                  value[j] = A_FORM.elements[i].options[k].text;
                j++;
                increased++;
              }
            }
            if(increased > 0) 
            {
              j--;
            }
            else 
            {
              value[j] = "";
            }
            j++;
            break;
        case"file":
            name[j] = A_FORM.elements[i].name; 
            value[j] = A_FORM.elements[i].value;
          j++;
          break;    
        default :
          name[j] = A_FORM.elements[i].name; 
          value[j] = A_FORM.elements[i].value;
          
          j++;
       }
    }
    
    var first = true;
    var indsname ="";
    var incolname="";
   for (i = 0; i < j; i++)
    {
      if(reqYn==false || RequiredProp[name[i]] == undefined)
      {
        if(name[i] == '') continue;
        if(name[i].indexOf("_") == -1) continue;
        indsname = name[i].substring(0, name[i].indexOf("_"));
        incolname= name[i].substring(name[i].indexOf("_")+1);
        if(indsname == uiprefix)
        {
          if(first)
          {
            plain_text += sndname +"_"+ incolname +"="+ value[i];
            first= false;
          }
          else
          {
            plain_text += "&"+sndname +"_"+ incolname+"="+ value[i];
          }
        }
      }
      else
      {
        if(value[i] == "")
        {
          alert(RequiredProp[name[i]]);
          var obj = document.getElementById(name[i]);
    
          obj.focus();
          if (obj.type == 'text' && obj.value.length >=1 ) obj.select();
          return null;
      
        }else{
      
      if(name[i] == '') continue;
      if(name[i].indexOf("_") == -1) continue;
      
      indsname = name[i].substring(0, name[i].indexOf("_"));
      incolname= name[i].substring(name[i].indexOf("_")+1);
      if(first)
          {
            plain_text += sndname +"_"+ incolname +"="+ value[i];
            first= false;
          }
          else
          {
            plain_text += "&"+sndname +"_"+ incolname+"="+ value[i];
          }
            
          }
      }
    }
    if(debug) alert("[INPUT-Single-Parmenters DATA:"+indsname+"=>"+sndname+"]\n"+plain_text);
    return plain_text;
  }
   ,
   getSingleQueryJson:function getSingleQueryJson(form, uiprefix, sndname, debug, reqYn)      // ----
                                                // kjs
  {
    
    if(typeof form == "object" && form.tagName == "FORM")
    {
      A_FORM = form;   // 파일업로드가 없는경우
    }else{
     
      A_FORM = form[0];// 파일업로드가 있는경우
    }

    var name = new Array(A_FORM.elements.length);
    var value = new Array(A_FORM.elements.length);
    var j = 0;
    var plain_text="";
    len = A_FORM.elements.length;
  // 파일 체크
      var jf = 0;
  var nameF = new Array(fileform.elements.length);
    var valueF = new Array(fileform.elements.length);
   Flen = fileform.elements.length;
   
  for ( i= 0 ; i< Flen; i++)
    {
    
    switch(fileform.elements[i].type)
      {
      case"file":
     
            nameF[jf] = fileform.elements[i].name; 
            valueF[jf] = fileform.elements[i].value;
      
       break;
      default :
          nameF[jf] = fileform.elements[i].name; 
          valueF[jf] = fileform.elements[i].value;
          
          jf++;
    }
  }
  

  for (i = 0; i <= jf; i++)
    {
    
     if(reqYn==false || RequiredProp[nameF[i]] == undefined)
      {
     
  
      }
      else
      {  
    
        if(valueF[i] == "")
        {
         alert(RequiredProp[nameF[i]]);
          var obj = document.getElementById(nameF[i]);
     
          obj.focus();
          
          return null;
      
        }
    }
   
      
    }
  
  
  
  // 파일 체크 끝
  
  
  
  
  
    for ( i= 0 ; i< len; i++)
    {
    
   
      switch(A_FORM.elements[i].type)
      {

        case "button":
        case "reset":
        case "submit":
        case "":
        break ;
        case "radio":
        case "checkbox":
              /*if(A_FORM.elements[i].checked == true)
              {
                name[j]  = A_FORM.elements[i].name;
                value[j] =A_FORM.elements[i].value;
                j++
                  break;
              }*/
              
			  name[j]  = A_FORM.elements[i].name;
              if(InitItems[name[j]] != undefined)
              {
                if(A_FORM.elements[i].checked == true)
                {
                  value[j] = InitItems[name[j]].TrueValue; 
                }
                else
                {
                  value[j] = InitItems[name[j]].FalseValue;
                }
              }
              else
              {
             // A_FORM.elements[i].value;
              if(A_FORM.elements[i].checked == true)
                {
                  value[j] =A_FORM.elements[i].value;
                }
               
              }
              j++;
              
              break;
        case "select-one":
            name[j] = A_FORM.elements[i].name;
            var ind = A_FORM.elements[i].selectedIndex;
			//alert(A_FORM.elements[i].options[ind].value);
            if(ind >=0){
              if(A_FORM.elements[i].options[ind].value != '')
                value[j] = A_FORM.elements[i].options[ind].value;
              else if(A_FORM.elements[i].options[ind].value == '')
				  value[j] = A_FORM.elements[i].options[ind].value; 
			  else
               value[j] = A_FORM.elements[i].options[ind].text;
            }else {
              value[j] = "";
			 
            }
			
            j++;
            break;
        case "select-multiple":
            name[j] = A_FORM.elements[i].name;
            var llen = A_FORM.elements[i].length;
            var increased = 0;
            for (k = 0; k< llen; k++)
            {
              if(A_FORM.elements[i].options[k].selected)
              {
                name[j] = A_FORM.elements[i].name;
                if (A_FORM.elements[i].options[k].value !='')
                  value[j] = A_FORM.elements[i].options[k].value; 
                else
                  value[j] = A_FORM.elements[i].options[k].text;
                j++;
                increased++;
              }
            }
            if(increased > 0) 
            {
              j--;
            }
            else 
            {
              value[j] = "";
            }
            j++;
            break;
        case"file":
            name[j] = fileform.elements[i].name; 
            value[j] = fileform.elements[i].value;
     // alert(name[j] + " / " + value[j]);
          j++;
          break;    
        default :
          name[j] = A_FORM.elements[i].name; 
          value[j] = A_FORM.elements[i].value;
          
          j++;
       }
    }
   
    var first = true;
    var indsname ="";
    var incolname="";
   for (i = 0; i < j; i++)
    {
    
      if(reqYn==false || RequiredProp[name[i]] == undefined)
      {
      
        if(name[i] == '') continue;
        if(name[i].indexOf("_") == -1) continue;
        indsname = name[i].substring(0, name[i].indexOf("_"));
        incolname= name[i].substring(name[i].indexOf("_")+1);
        if(indsname == uiprefix)
        {
       
          if(first)
          {
            plain_text += '{ "inDsList":"'+sndname+'","recordList":['
            plain_text += '{"'+ incolname +'":"'+ wizutil.JSONData_Char(value[i])+'",';
            first= false;
          }
          else
          {
            plain_text += '"'+ incolname +'":"'+ wizutil.JSONData_Char(value[i])+'",';
          }
        }
    
      }
      else
      {
      
        if(value[i] == "")
        {
         alert(RequiredProp[name[i]]);
          var obj = document.getElementById(name[i]);
     
          obj.focus();
          if (obj.type == 'text' && obj.value.length >=1 ) obj.select();
          return null;
      
        }else{
      
      if(name[i] == '') continue;
      if(name[i].indexOf("_") == -1) continue;
      
      indsname = name[i].substring(0, name[i].indexOf("_"));
      incolname= name[i].substring(name[i].indexOf("_")+1);
      if(first)
          {
             plain_text += '{ "inDsList":"'+sndname+'","recordList":[';
            plain_text += '{"'+ incolname +'":"'+ wizutil.JSONData_Char(value[i])+'",';
            first= false;
          }
          else
          {
             plain_text += '"'+ incolname +'":"'+wizutil.JSONData_Char(value[i])+'",';
          }
            
          }
      }
    }
    if(!first){
     plain_text += '} ] }';
    }
    console.log("[INPUT-Single-Parmenters DATA:"+uiprefix+"=>"+sndname+"]\n"+"input")
    if(debug) alert("[INPUT-Single-Parmenters DATA:"+uiprefix+"=>"+sndname+"]\n"+plain_text);
    return plain_text;
  }
  ,
  JSONData_Char: function JSONData_Char(data){
	  
	  
	    if(typeof(data) == "undefined" ){
	      
	      
	      return;
	    }
		if(data== null){
			
			return "";
		}
     // 아스키코드 문자 사용하여 변경 서버단에서 다시 변경함.
    // 아스키코드 문자 사용하여 변경 서버단에서 다시 변경함.  
    data = data.replace(/"/g, "");
    data = data.replace(/%/g, "");
    data = data.replace(/&/g, "");
    data = data.replace(/#/g, "");
    data = data.replace(/\+/g, "");
    data = data.replace(/\\/g, "");
     //data = data.replace(/\>/g, ">");
   //  data = data.replace(/\</g, ""); 
    return data;
  },
  DecodeData: function DecodeData(data){
	  
	 if(typeof(data) == "undefined" ){
	      
	      
	      return;
	    }
		if(data== null){
			
			return "";
		}
   
    data = data.replace(//g, "<");  
     data = data.replace(//g, "'");
     data = data.replace(//g, "\\");
     data = data.replace(/&amp;/g, "&");
	   data = data.replace(//g, "&");
	   data = data.replace(//g, '"');  
     data = data.replace(//g, "%");
	  data = data.replace(/&quot;/g, '"');
    // data = data.replace(/\&gt/g, ">");
 
     


 //   console.log(data + " DATA2 ");
   /* data = data.replace(/&/g, "");
    data = data.replace(/\\/g, "");*/
    return data;
  }
  ,   // ********************** 2016.02.12 check value 기능 추가 start
  CheckNumberValue:function CheckNumberValue(obj)   
  { 
    
    var objinfo;
    var rtn = true;
    objinfo = this.getChkNumberObject(obj);

    if( objinfo == null)
    {
      return true;
    }
   
    if(objinfo.MaxValue != undefined)
    {
      
      if( this.MaxValueCheck(objinfo.MaxValue, obj) == false)
      {
        alert("최대값을 초과하였습니다.");
        obj.focus();
        rtn = false;
      }
      else if( this.MinValueCheck(objinfo.MinValue, obj) == false)
      {
        alert(objinfo.MinValue +" 값보다 큰수를 입력하세요.");
        obj.focus();
        rtn = false;
      }
      else if( this.numberPointLenCheck(objinfo.PointLen, obj) == false)
      {
        alert(objinfo.PointLen +" 자리수 소숫점을 초과했습니다.");
        obj.focus();
        rtn = false;
      }
    }
    
    if(rtn)
    {
      if(objinfo.Comma != undefined && objinfo.Comma == true)
      {
        this.numberKeyIn(obj);
      }
      return true;
    }
    else
    {
      return false;
    }
  }
  ,
  MinValueCheck:function MinValueCheck(minvalue,obj) // 최소, 최대값 Check
  {
     var rvcomma = this.removeCommaFormat(obj.value);
    if( isNaN(rvcomma) ) return false;  
    var num = parseFloat(rvcomma);
    if(minvalue <= num) return true;
    return false;
  }
  ,
  MaxValueCheck:function MaxValueCheck(maxvalue, obj) // 최소, 최대값 Check
  { 

    var rvcomma = this.removeCommaFormat(obj.value);
    if( isNaN(rvcomma) ) return false;  
    var num = parseFloat(rvcomma);
    if(num <= maxvalue) return true;
    return false;
  }
  ,
  numberPointLenCheck:function numberPointLenCheck(len, obj) // 소숫점 아래 자리수
                                // return;
  {
    var rvcomma = this.removeCommaFormat(obj.value);
    if(rvcomma.indexOf(".") != -1)
    {
      var pointstr = rvcomma.substring(rvcomma.indexOf(".")+1);
      if( pointstr.length > len) return false;
    }
    return true;
  }
  ,
  getChkNumberObject:function getChkNumberObject(obj) // 숫자 타입에서 쓸 수 있도록
                            // format() 함수 추가
  {
   
    if(ChkNumberColumns.length == 0) return;
    for(var i=0;i<ChkNumberColumns.length;i++)
    {
      if(ChkNumberColumns[i].id == obj.id)
      {
        
        return ChkNumberColumns[i];
      }
    }
    return;
  } 
  ,
  numberKeyIn:function numberKeyIn(obj)
  {
    var keyCode = event.keyCode;
    if( (keyCode == 8) || // BACK
        (keyCode == 9) || // TAB
        (keyCode == 16) ||  // SHIFT
        (keyCode == 17) ||  // CTL
        (keyCode == 18) ||  // ALT
        (keyCode == 46) ||  // DEL
        (keyCode == 37) ||  // ←
        (keyCode == 38) ||  // ↑
        (keyCode == 39) ||  // →
        (keyCode == 40) ||  // ↓
        (keyCode == 107) || // +
        (keyCode == 13) ||  // Enter
        (keyCode == 36) ||  // HOME
        (keyCode == 35) )   // END
        {
         return;
        }
    var rvcomma = this.removeCommaFormat(obj.value);
    obj.value = this.Stringformat(rvcomma);
  }
  ,
  removeCommaFormat:function removeCommaFormat(str)         // 숫자 타입에서 쓸 수 있도록
                              // format() 함수 추가
  {
    var trimval = str.replace(/ /gi,"");
    return trimval.replace(/,/gi,"");
  }
  ,
  Numberformat:function Numberformat(numbervalue)     // 숫자 타입에서 쓸 수 있도록
                            // format() 함수 추가
  {
      if(numbervalue==0) return 0;
      var reg = /(^[+-]?\d+)(\d{3})/;
      var n = (numbervalue + '');
      while (reg.test(n)) n = n.replace(reg, '$1' + ',' + '$2');
      return n;
  }
  ,
  Stringformat:function Stringformat(stringvalue)    // 문자열 타입에서 쓸 수 있도록
                            // format() 함수 추가
  {   
      var idx =0;
      var pointstring ="";
      if( ( idx = stringvalue.indexOf(".")) != -1)
      {
        pointstring = stringvalue.substring(idx);
        stringvalue = stringvalue.substring(0,idx);
      }
      var num = parseFloat(stringvalue);
      if( isNaN(num) ) return "0";
      return this.Numberformat(num) + pointstring;    // *****************************
                            // 2016.02.12 check
                            // value 기능 추가 start
  }
  ,
   findRequiredName:function findRequiredName(namex) 
  {
    var msg = RequiredProp[namex]; 
    return msg;
  }
  ,
  findRadioName:function setRadioChecked(namex) 
  {
    if(RadioProp["NameList"] == undefined) return false;
    var namestr = RadioProp["NameList"];
    if(namestr == null || namestr == "" ) return false;
    
    var nlist = namestr.split(",");
    for(var i=0;i<nlist.length;i++)
    {
      if(nlist[i] ==  namex)
      {
        return true;
      }
    }
    return false;
  }
  ,
  setRadioChecked:function setRadioChecked(namex, valx) 
  {
    var obj = document.getElementsByName(namex);
    for( i=0; i<obj.length; i++) 
    {
      if(obj[i].value == valx) 
      {
        obj[i].checked = true;
        break;
      }
    }
  }
  ,
  getRadioCheckedValue:function getRadioCheckedValue(namex) 
  {
    var obj = document.getElementsByName(namex);
    // var checked_index = -1;
    var checked_value = '';
    for( i=0; i<obj.length; i++) 
    {
      if(obj[i].checked) 
      {
        // checked_index = i;
        checked_value = obj[i].value;
      }
    }
    return checked_value;
  }
  ,
  setSingleDataset: function(msg, uiprefix, rcvdataset)      // kjs---
  {
    var chkname,chkvalue;
    var JsonObj =  msg[rcvdataset];
  
    if(JsonObj == undefined){
		return;
	
	}
    for (var key in JsonObj[0]) 
    {
       if(this.findRadioName(uiprefix+"_"+key))   // Radio Button 값처리
       {
         this.setRadioChecked(uiprefix+"_"+key, JsonObj[0][key]);
       }
       else
       {
         if( $("#"+uiprefix +"_" + key)[0] == undefined) continue; 
         if(CheckProp[key] != undefined)          // check box 값처리
         {
           chkname = CheckProp[key];
           chkvalue = wizutil.DecodeData(JsonObj[0][key]);
           if(chkvalue == InitItems[chkname].TrueValue)
           {
             $("#"+chkname)[0].checked = true;   
           }
           else
           {
             $("#"+chkname)[0].checked = false;
           }
         }
        //alert($("#"+uiprefix +"_" +key)[0].tagName + $("#"+uiprefix +"_" + key)[0].type);
         switch( $("#"+uiprefix +"_" +key)[0].tagName + $("#"+uiprefix +"_" + key)[0].type) 
         {
           case 'INPUTcheckbox':
              if($("#"+uiprefix +"_" + key).val() == wizutil.DecodeData(JsonObj[0][key]))
                {
                 $("#"+uiprefix +"_" + key)[0].checked = true;
                }
                break;
           case 'SELECTselect-one':
              $("#"+uiprefix +"_" + key).val(wizutil.DecodeData(JsonObj[0][key]));
                break;
           case 'DIVundefined':  // PJY 추가
            // alert(JsonObj[0][key]);
            $("#"+uiprefix +"_" + key).html(wizutil.DecodeData(JsonObj[0][key]));
                break;
           default : 
    //    alert(uiprefix + " @@ " + key + " @@ " + JsonObj[0][key] );
      // $("#"+uiprefix +"_" + key).val());
              $("#"+uiprefix +"_" + key).val( wizutil.DecodeData(JsonObj[0][key]));
        // alert( $("#"+uiprefix +"_" + key).val());
                break;
          }
        }
     }
  }
  ,
  DatasetQueryJson:function DatasetQueryJson(grid, dsname , statusType , debug)
  {
    var isfirst = true;
    var wizGrid= $('#'+grid);
    var plain_text ="";
    
    var rowindex = 0;
    var rowCount = wizGrid.getGridParam("reccount");
    var colSaveName= wizGrid.wizGrid('getGridParam', 'Columns');
    // 수정중인 셀 닫음
    // 전체행의 ID(key)가져오기
    var ids = wizGrid.getDataIDs();
    var cellvalue="";
    // 열정보 가져오기
    
    for(var i = 0; i<ids.length; i++)
    {
       for(var j = 1; j<colSaveName.length; j++)
       {
         wizGrid.editCell(i+1,j,false);            
       }
    }
    // 순서를 늦게 해야함 FLAG값이 지나처버림
    var sRow = wizutil.FindStatusRows(statusType,grid);
    var arrRow = sRow.split(",");
    
   // plain_text += wizGrid.getInputSendParameters(statusType);
    plain_text += '{ "inDsList":"'+dsname+'","recordList":['

    if(sRow != "")
    {
       for(var ir=0; ir < arrRow.length-1; ir++)
       {
          rowindex = arrRow[ir];
          // 멀티체크 랑 순번이 같이 있을 때
          // ----------------------------------------------------------------------------------GFormat
          // 처리 추가 부분 : format 삭제처리 -- start
          if(colSaveName[0]['name']=='rn' && colSaveName[1]['name'] =='cb')
          {
            plain_text += '{';
            for(var ic=2; ic <colSaveName.length; ic++)
            { 

              cellvalue = wizGrid.wizGrid('getCell', rowindex, colSaveName[ic]['name']);

              if( colSaveName[ic]['Gtype'] != undefined && colSaveName[ic]['Gtype'] == "number")  
              {
                cellvalue = this.removeNumberFmt( cellvalue, colSaveName[ic]['GFormat']);
              }
              else if(colSaveName[ic]['GFormat'] != undefined) 
              {
                cellvalue = this.removeGFormat( colSaveName[ic]['GFormat'], cellvalue);
              }
              

                   
               plain_text += '"'+ colSaveName[ic]['name'] +'":"'+ wizutil.JSONData_Char(cellvalue)+'",'; //
               // plain_text += dsname + "_" + colSaveName[ic]['name'] + "=" +
               // cellvalue;
            }
            plain_text += ' },';
           
           // 멀티체크나 순번 둘중 하나 추가 됬었을 때
         }
         else if(colSaveName[0]['name'] =='rn' || colSaveName[0]['name'] =='cb')
         {
          plain_text += '{';
           for(var ic=1; ic <colSaveName.length; ic++)
           { 
              cellvalue = wizGrid.wizGrid('getCell', rowindex, colSaveName[ic]['name']);
              if( colSaveName[ic]['Gtype'] != undefined && colSaveName[ic]['Gtype'] == "number")  
              {
                cellvalue = this.removeNumberFmt( cellvalue, colSaveName[ic]['GFormat']);
              }
              else if(colSaveName[ic]['GFormat'] != undefined) 
              {
                cellvalue = this.removeGFormat( colSaveName[ic]['GFormat'], cellvalue);
              }
              
                plain_text += '"'+ colSaveName[ic]['name'] +'":"'+ wizutil.JSONData_Char(cellvalue)+'",'; //
                // plain_text += dsname + "_" + colSaveName[ic]['name'] + "=" +
        // cellvalue;
          }
          plain_text += ' },';
          
         }
         else
         {
           // 멀리체크 순번 둘다 없을 때
          plain_text += '{';
           for(var ic=0; ic <colSaveName.length; ic++)
           {      
              cellvalue = wizGrid.wizGrid('getCell', rowindex, colSaveName[ic]['name']);
              if( colSaveName[ic]['Gtype'] != undefined && colSaveName[ic]['Gtype'] == "number")  
              {
                cellvalue = this.removeNumberFmt( cellvalue, colSaveName[ic]['GFormat']);
              }
              else if(colSaveName[ic]['GFormat'] != undefined) 
              {
                cellvalue = this.removeGFormat( colSaveName[ic]['GFormat'], cellvalue);
              }
             
              plain_text += '"'+ colSaveName[ic]['name'] +'":"'+ wizutil.JSONData_Char(cellvalue)+'",'; //
                // plain_text += dsname + "_" + colSaveName[ic]['name'] + "=" +
        // cellvalue;
           }
           plain_text += ' },';
         }
         // ----------------------------------------------------------------------------------GFormat
      // 처리 추가 부분 : format 삭제처리 end
         
       }
    }
    plain_text += ' ] },';
  
    if(debug) alert("INPUT-GRID-DATA("+dsname+")\n"+plain_text);
    return plain_text;
  },
  
  DatasetQueryString:function DatasetQueryString(grid, dsname , statusType , debug)
  {
    var isfirst = true;
    var wizGrid= $('#'+grid);
    var plain_text ="";
    
    var rowindex = 0;
    var rowCount = wizGrid.getGridParam("reccount");
    var colSaveName= wizGrid.wizGrid('getGridParam', 'Columns');
    // 수정중인 셀 닫음
    // 전체행의 ID(key)가져오기
    var ids = wizGrid.getDataIDs();
    var cellvalue="";
    // 열정보 가져오기
    
    for(var i = 0; i<ids.length; i++)
    {
       for(var j = 1; j<colSaveName.length; j++)
       {
         wizGrid.editCell(i+1,j,false);            
       }
    }
    // 순서를 늦게 해야함 FLAG값이 지나처버림
    var sRow = wizutil.FindStatusRows(statusType,grid);
    var arrRow = sRow.split(",");
    
   // plain_text += wizGrid.getInputSendParameters(statusType);
   plain_text += '{ "inDsList":"'+dsname+'","recordList":['
    if(sRow != "")
    {
       for(var ir=0; ir < arrRow.length-1; ir++)
       {
          rowindex = arrRow[ir];
          // 멀티체크 랑 순번이 같이 있을 때
          // ----------------------------------------------------------------------------------GFormat
      // 처리 추가 부분 : format 삭제처리 -- start
          if(colSaveName[0]['name']=='rn' && colSaveName[1]['name'] =='cb')
          {
            for(var ic=2; ic <colSaveName.length; ic++)
            { 

              cellvalue = wizGrid.wizGrid('getCell', rowindex, colSaveName[ic]['name']);

              if( colSaveName[ic]['Gtype'] != undefined && colSaveName[ic]['Gtype'] == "number")  
              {
                cellvalue = this.removeNumberFmt( cellvalue, colSaveName[ic]['GFormat']);
              }
              else if(colSaveName[ic]['GFormat'] != undefined) 
              {
                cellvalue = this.removeGFormat( colSaveName[ic]['GFormat'], cellvalue);
              }
              

              if(isfirst)
              {       

                plain_text += dsname + "_" + colSaveName[ic]['name'] + "=" + cellvalue;
                isfirst = false;
              }
              else
              {
                    
                plain_text += "&" + dsname + "_" + colSaveName[ic]['name'] + "=" + cellvalue;
               

              }
            }
           // 멀티체크나 순번 둘중 하나 추가 됬었을 때
         }
         else if(colSaveName[0]['name'] =='rn' || colSaveName[0]['name'] =='cb')
         {
         
           for(var ic=1; ic <colSaveName.length; ic++)
           { 
              cellvalue = wizGrid.wizGrid('getCell', rowindex, colSaveName[ic]['name']);
              if( colSaveName[ic]['Gtype'] != undefined && colSaveName[ic]['Gtype'] == "number")  
              {
                cellvalue = this.removeNumberFmt( cellvalue, colSaveName[ic]['GFormat']);
              }
              else if(colSaveName[ic]['GFormat'] != undefined) 
              {
                cellvalue = this.removeGFormat( colSaveName[ic]['GFormat'], cellvalue);
              }
              
              if(isfirst)
              {       
                plain_text += dsname + "_" + colSaveName[ic]['name'] + "=" + cellvalue;
                isfirst = false;
              }
              else
              {
                plain_text += "&" + dsname + "_" + colSaveName[ic]['name'] + "=" + cellvalue;
              }
          }
           // 멀리체크 순번 둘다 없을 때
         }
         else
         {
          
           for(var ic=0; ic <colSaveName.length; ic++)
           {      
              cellvalue = wizGrid.wizGrid('getCell', rowindex, colSaveName[ic]['name']);
              if( colSaveName[ic]['Gtype'] != undefined && colSaveName[ic]['Gtype'] == "number")  
              {
                cellvalue = this.removeNumberFmt( cellvalue, colSaveName[ic]['GFormat']);
              }
              else if(colSaveName[ic]['GFormat'] != undefined) 
              {
                cellvalue = this.removeGFormat( colSaveName[ic]['GFormat'], cellvalue);
              }
             
             if(isfirst)
             {        
               plain_text += dsname + "_" + colSaveName[ic]['name'] + "=" + cellvalue;  
               isfirst = false;
             }
             else
             {
               plain_text += "&" + dsname + "_" + colSaveName[ic]['name'] + "=" + cellvalue;
             }
           }
         }
         // ----------------------------------------------------------------------------------GFormat
      // 처리 추가 부분 : format 삭제처리 end
         
       }
    }
    if(debug) alert("INPUT-GRID-DATA("+dsname+")\n"+plain_text);
    return plain_text
  },
  // excel
  DatasetExcelString:function DatasetExcelString(grid, dsname , statusType ,ExcelName ,ExcludeColnm,HiddenCol)
  {

    var isfirst = true;
    var wizGrid= $('#'+grid);
    var plain_text ="";
    var totalrecord ="";
    var rowindex = 0;
    var rowCount = wizGrid.getGridParam("reccount"); // 현재 페이징에 인한 row 수
    var TotalrowCount = wizGrid.getGridParam("records");// 조회된 전체 ROW 수
    var WizGridCnt = "" ;
    var gridCol = $("#gview_"+grid+ "  table.ui-wizgrid-htable");
    var colSaveName= wizGrid.wizGrid('getGridParam', 'Columns');
    var HeadName= wizGrid.wizGrid('getGridParam', 'Names');
    var currowindx = wizGrid.getCurrentRowIndex(); 
    var boolcol = false;
    // 히든컬럼은 엑셀 다운 할지 안할지 정함
    if(HiddenCol){
       boolcol = true;
    }
   // alert(wizGrid.getSendParameters("A"));
     
    // 수정중인 셀 닫음
    // 전체행의 ID(key)가져오기
   // var ids = wizGrid.getDataIDs();

   
     if(currowindx != -1)wizGrid.editRowClose(currowindx+1);
      
              
    var GridHeadCnt = gridCol.children().children().eq(1).children().length;
    if( GridHeadCnt == 0){
        //그리드 헤더가 한줄 일때.
        
        if(boolcol){
            plain_text += wizGrid.getExcelSendParametersHidden();// 그리드 히든 칼럼 포함
            plain_text += wizutil.GridHeadInfoList(grid , boolcol,gridCol ,GridHeadCnt,ExcludeColnm);
          }else{
             plain_text += wizGrid.getExcelSendParameters(); // 그리드 히든 칼럼 제외 데이타 넘김
             plain_text += wizutil.GridHeadInfoList(grid , boolcol,gridCol ,GridHeadCnt,ExcludeColnm);         
          }
        }
        else 
        {
          
          // 그리드 헤더가 두줄 일 때 . 
          if(boolcol){
            plain_text += wizGrid.getExcelSendParametersHidden();// 그리드 히든 칼럼 포함
            plain_text += wizutil.GridHeadInfoList(grid , boolcol,gridCol ,GridHeadCnt,ExcludeColnm);
          }else{
             plain_text += wizGrid.getExcelSendParameters(); // 그리드 히든 칼럼 제외 데이타 넘김
             plain_text += wizutil.GridHeadInfoList(grid , boolcol,gridCol,GridHeadCnt,ExcludeColnm);         
          }

        }
      // "(\"" + filename +"\",\""
    
    // 엑설 이름 파리미터 네이밍 WizGridExcelFileName에서 변경되면 서버에서도 수정해줘야함 서버에서는
  // WizGridExcelFileName 값으로 받고있음
    // 헤더가 한줄일 때
    if( GridHeadCnt == 0){
    plain_text += '{"' + "WizGridExcelFileName"+ '":';
    plain_text += '"' + ExcelName+ '"},';
   // plain_text += "&WIZEXCEL_WizGridExcelFileName="+ExcelName;
    plain_text += " ]}]}" ;
    }else{
    	//헤더가 두줄일떄 데이타 영역 리스트 추출
    	 plain_text += '{"' + "WizGridExcelFileName"+ '":';
    	    plain_text += '"' + ExcelName+ '"},';
    	   // plain_text += "&WIZEXCEL_WizGridExcelFileName="+ExcelName;
    	    plain_text += " ]}," ; // headData 끝
  
            if(boolcol){     
                plain_text += wizutil.GridDataHeadInfoList(grid , boolcol,gridCol ,GridHeadCnt,ExcludeColnm);
              }else{      
                 plain_text += wizutil.GridDataHeadInfoList(grid , boolcol,gridCol ,GridHeadCnt,ExcludeColnm);         
              }
    	    
            plain_text += " ]}" ; // DataColumnList 끝
    	    
    	    plain_text += " ]}" ;//  ExcelWizGrid 끝
    	
    }
    
   
    // lain_text = plain_text.replace(/%/gi,'ASCI37');
  // alert(plain_text);
    // if(true) alert("Excel-GRID-DATA("+dsname+")\n"+plain_text);
    return plain_text;
  },
  // 칼럼 항목 리스트 추출 
   GridHeadInfoList:function(grid, hiddenColBool,gridCol,GridHeadCnt,ExcludeColnm)
  {
         var rtn = "";
         rtn += "&ExcelDown={\"" +"ExcelWizGrid"+ "\":[{" ; 
         rtn += " \"headData\":[" ;
         //헤더가 한줄
        if(GridHeadCnt == 0){
         var HeadInfo_1 = gridCol.children().children().eq(0).children();
        
         if(hiddenColBool == false){
            HeadInfo_1.each(function(i) {
              // 히든 컬럼 빼고
            if( $(this).attr("style") == undefined ||$(this).attr("style").indexOf("none") == -1 ){
              if(!(wizutil.GridHeadValCheck(this,ExcludeColnm))){
               
                rtn += '{"' + this.id.substring(6,this.id.length) + '":';
                rtn += '"' + wizutil.JSONData_Char($(this).text().trim()) + '",';
                rtn +='},';
              }
             
              }
               }) ; 
          }else{
        	
            HeadInfo_1.each(function(i) {
              if(!(wizutil.GridHeadValCheck(this,ExcludeColnm))){
                //히든컬럼 포함
                rtn += '{"' + this.id.substring(6,this.id.length) + '":';
                rtn += '"' + wizutil.JSONData_Char($(this).text().trim()) + '",';
                rtn +='},';
              }
            }) ; 
          }
        }else{
        	//헤더가 두줄
        	  if(hiddenColBool == false){
	
	        	var MergeHeadInfo_1 = gridCol.children().children().eq(1).children();
	        	var  MergeHeadInfo_2 = gridCol.children().children().eq(2).children();
	            MergeHeadInfo_1.each(function(i) {
	            	  // 히든 컬럼 빼고
	            	if(!(wizutil.GridHeadValCheck(this,ExcludeColnm)) ){   //$(this).attr("style").indexOf("none") 
	                if($(this).attr("style") == undefined){
			              
			                if(this.id ==""){
			                	rtn += '{"' + wizutil.JSONData_Char($(this).text().trim())+ '":';
			            	    rtn += '"' + wizutil.JSONData_Char($(this).text().trim()) + '",';
			                }else{
			                	rtn += '{"' + this.id.substring(6,this.id.length) + '":';
			            	    rtn += '"' + wizutil.JSONData_Char($(this).text().trim()) + '",';
			                	
			                }
			            	    
			                if(this.rowSpan >1){
			                	rtn += '"' + "rowSpan" + '":' +'"' +this.rowSpan + '",';
			                }
			                if(this.colSpan >1){
			                	rtn += '"' + "colSpan" + '":' +'"' +this.colSpan + '",';
			                }
			             
			                rtn +='},';
			              }else if($(this).attr("style").indexOf("none")  == -1){
			            	  
			            	  if(this.id ==""){
				                	rtn += '{"' + wizutil.JSONData_Char($(this).text().trim())+ '":';
				            	    rtn += '"' + wizutil.JSONData_Char($(this).text().trim()) + '",';
				                }else{
				                	rtn += '{"' + this.id.substring(6,this.id.length) + '":';
				            	    rtn += '"' + wizutil.JSONData_Char($(this).text().trim()) + '",';
				                	
				                }
			                if(this.rowSpan >1){
			                	rtn += '"' + "rowSpan" + '":' +'"' +this.rowSpan + '",';
			                }
			                if(this.colSpan >1){
			                	rtn += '"' + "colSpan" + '":' +'"' +this.colSpan + '",';
			                }
			             
			                rtn +='},'; 
			            	  
			              }else{
			            	  
			            	  
			              }   
	             }
	          }) ; 
	            // 병합 처리 없는 컬럼 리스트
	          MergeHeadInfo_2.each(function(i) {
	        	  
	        	  // 히든 컬럼 빼고
	        	  if($(this).attr("style") == undefined){
	        		  rtn += '{"' + this.id.substring(6,this.id.length) + '":';
		        	  rtn += '"' + wizutil.JSONData_Char($(this).text().trim()) + '",';
		        	  rtn +='},';
	        		  
	        	  }else if(  $(this).attr("style").indexOf("none") == -1){
	        	  rtn += '{"' + this.id.substring(6,this.id.length) + '":';
	        	  rtn += '"' + wizutil.JSONData_Char($(this).text().trim()) + '",';
	        	  rtn +='},';
	        	  }else{
	        		  
	        		  
	        	  }
	
	         });
          }else{
        	  
        	  // 히든컬럼 포함 다운로드
        	  var MergeHeadInfo_1 = gridCol.children().children().eq(1).children();
        	  var MergeHeadInfo_2 = gridCol.children().children().eq(2).children();
	            MergeHeadInfo_1.each(function(i) {
	              if(!(wizutil.GridHeadValCheck(this,ExcludeColnm)) ){
	            	  
	            	  if(this.id ==""){
		                	rtn += '{"' + wizutil.JSONData_Char($(this).text().trim())+ '":';
		            	    rtn += '"' + wizutil.JSONData_Char($(this).text().trim()) + '",';
		                }else{
		                	rtn += '{"' + this.id.substring(6,this.id.length) + '":';
		            	    rtn += '"' + wizutil.JSONData_Char($(this).text().trim()) + '",';
		                	
		                }
		            	    
		                if(this.rowSpan >1){
		                	rtn += '"' + "rowSpan" + '":' +'"' +this.rowSpan + '",';
		                }
		                if(this.colSpan >1){
		                	rtn += '"' + "colSpan" + '":' +'"' +this.colSpan + '",';
		                }
		             
		                rtn +='},';
		             
	              }           
	          }) ; 
	            // 병합 처리 없는 컬럼 리스트
	          MergeHeadInfo_2.each(function(i) {
	        	  rtn += '{"' + this.id.substring(6,this.id.length) + '":';
	        	  rtn += '"' + wizutil.JSONData_Char($(this).text().trim()) + '",';
	        	  rtn +='},';
        	  
	          }) ; 
        }
      }
      return rtn;
  },
  // Data 영역 칼럼 항목 리스트 추출 
  GridDataHeadInfoList:function(grid, hiddenColBool,gridCol,GridHeadCnt,ExcludeColnm)
 {
        var rtn = "";
        rtn += "{ \"DataColumnList\":[" ;

        var HeadInfo_1 = gridCol.children().children().eq(1).children();
        var HeadInfo_2 = gridCol.children().children().eq(2).children();
        var DataList = new Array();
        if(hiddenColBool == false){
        	
        	HeadInfo_2.each(function(i) {
        		
        		DataList[i] = this.id.substring(6,this.id.length) ;
        		
        		 
        	 }) ; 
           HeadInfo_1.each(function(i) {
             // 히든 컬럼 빼고
           if( $(this).attr("style") == undefined ||$(this).attr("style").indexOf("none") == -1 ){
             if(!(wizutil.GridHeadValCheck(this,ExcludeColnm))){
             if($(this).attr("id") == undefined){
            	 var LastSize= $(this).attr("colspan");
            	 // 배열셋팅된값을 for문 돌려서 빼서 셋팅
            	 for(var dai = 0 ; dai < DataList.length; dai++){
            		 if(dai < LastSize){
            			 rtn += '{"' + DataList[dai] + '":';
                         rtn += '"' + wizutil.JSONData_Char($(this).text().trim()) + '",';
                         rtn +='},';
                       
            		 
            		 }
            	 }
            	  DataList.splice(0,LastSize);
             }else{
            	 rtn += '{"' + this.id.substring(6,this.id.length) + '":';
                 rtn += '"' + wizutil.JSONData_Char($(this).text().trim()) + '",';
                 rtn +='},';
            	 
                 }
                 
               }
            
             }
              }) ; 
         }else{
        	 HeadInfo_2.each(function(i) {
         		
         		DataList[i] = this.id.substring(6,this.id.length) ;
         		
         		 
         	 }) ; 
           HeadInfo_1.each(function(i) {
             if(!(wizutil.GridHeadValCheck(this,ExcludeColnm))){
               //히든컬럼 포함
            	   if($(this).attr("id") == undefined){
                  	 var LastSize= $(this).attr("colspan");
                  	 // 배열셋팅된값을 for문 돌려서 빼서 셋팅
                  	 for(var dai = 0 ; dai < DataList.length; dai++){
                  		 if(dai < LastSize){
                  			 rtn += '{"' + DataList[dai] + '":';
                               rtn += '"' + wizutil.JSONData_Char($(this).text().trim()) + '",';
                               rtn +='},';
                             
                  		 
                  		 }
                  	 }
                  	  DataList.splice(0,LastSize);
                   }else{
                  	 rtn += '{"' + this.id.substring(6,this.id.length) + '":';
                       rtn += '"' + wizutil.JSONData_Char($(this).text().trim()) + '",';
                       rtn +='},';
                  	 
                   }
            	   
             }
           }) ; 
         }
       
     return rtn;
 },
  GridHeadValCheck:function(obj,ExcludeColnm){
	  
	  var arrcolumn = true;
	  ExcludeColnm.forEach(function (i){ 
			//  console.log(i + " @@" + aa[i] );
			  if(obj.id.substring(6,obj.id.length) == i){
				  // 제외 컬럼이 있으면 false 변경
				  arrcolumn = false;
				  
			  } 
		  });
	  
	 if(!arrcolumn){
		 return true;
	 }
	 if(obj.id.substring(6,obj.id.length) != "rn" &&obj.id.substring(6,obj.id.length) != "cb" && obj.id.substring(6,obj.id.length) != "id" && obj.id.substring(6,obj.id.length) != "IUDFLAG" && !$(obj).text() == "" ){
		  return false;
	  }else{
		  return true;
	  } 
  },
  getComboParameter:function(form)
  {
      if(typeof form != "object"|| form.tagName != "FORM")
    {
      alert("Form Parameter의 인자는 FORM 태그가 아닙니다.");
      return "";
      
    }
      var name =new Array(form.elements.length);
      var value =new Array(form.elements.length);
      var j = 0 ;
      var plain_text= "";
      len = form.elements.length;
      for(var i = 0; i < len; i++)
    {
      switch(form.elements[i].tagName)
      {
        case "OBJECT":
          if(wizutil.isCombo(form.elements[i].id))
          {
            if(j==0)
            {
              plain_text += form.elements[i].id + "=" + form.elements[i].code;
            }else{
              plain_text += "&"+form.elements[i].id + "=" + form.elements[i].code;
            }
            j++;
          }
          break;
          default:
          break;
      }
    }
    return plain_text;
  }
  
  ,
  // 싱글 콤보 그리드 콤보..
  InitComboData:function (urlx,datax,DataSet,callback,debug){
    var arrSet = DataSet.split(",");
    $.ajax({
      type:"post",
      async:false,
      url:urlx,
      // data:datax,
      dataType:"json",
      success: function(msg)
      {
        for(var i=0; i<arrSet.length;i++)
        {
          tmpset = arrSet[i].split(":");
          ObjName = tmpset[0];
          datasetnm = tmpset[1];
          // 그리드 안에 콤보
          if($('#'+ObjName).attr('elType')=='Grid')
          {
            var Jcnt = msg[datasetnm].length;
            var comString="";
            for(ic= 0; ic<Jcnt-1; ic++){
              comString += msg[datasetnm][ic].CODE+":"+msg[datasetnm][ic].NAME+";";
            }
            comString += msg[datasetnm][Jcnt-1].CODE+":"+msg[datasetnm][Jcnt-1].NAME;
          }
          else
          {
            // 싱글 콤보
            var Jcnt3 = msg[datasetnm].length;
            for(ic= 0; ic<Jcnt3; ic++)
            {
              $("#"+ObjName).append("<option value='" + msg[datasetnm][ic].CODE + "'>"+msg[datasetnm][ic].NAME+"</option>");
            }
          }
        }
        if(debug) alert("--------Return dataset[comboData]------------------\n"+comString);
        if(callback !='')
        {
          eval(callback)(comString);          
        }
      },
      error: function(request,status , error)
      {
        if(request.status =="500")
        {
          location.href="#"
        }
        else
        {
          alert("Ajax calling Error :"+status+":"+error);
        }
      }
    });
    
  }
  ,
  SingleSetting: function(msg,outputInfo)      // 박준용
  {
    var DataSet =outputInfo.split(",");
    for(var i=0; i<DataSet.length;i++)
    {
      if(DataSet[i].indexOf(":")!= -1)
      {
        tmpset = DataSet[i].split(":");
        S_obj = tmpset[0];
        SingleDataSet = tmpset[1];
        
        /*
     * var Jcnt = msg[SingleDataSet].length; if(Jcnt >1){ alert("싱글 데이터 건이
     * 아닙니다.") return; }
     */
        var JsonObj =  msg[SingleDataSet];
        for (var key in JsonObj[0]) 
        {
                    // alert( JsonObj[0][key] );
           if($("#"+S_obj +"_" + key)[0] == undefined) continue; 
         
           switch( $("#"+S_obj +"_" +key)[0].tagName + $("#"+S_obj +"_" + key)[0].type) 
           {
             case 'INPUTcheckbox':
              // alert(JsonObj[0][key]+"@@"+$("#"+S_obj +"_" + key).val());
                if($("#"+S_obj +"_" + key).val() == JsonObj[0][key])
                  {
                   $("#"+S_obj +"_" + key)[0].checked = true;
                  }
                  break;
             case 'SELECTselect-one':
          
              // $("#"+S_obj+ ' eq(1)').attr('seleted','seleted');
                $("#"+S_obj +"_" + key).val(JsonObj[0][key]);
                  break;
             default : 
                $("#"+S_obj +"_" + key).val(JsonObj[0][key]);
                  break;
            }
         }
       }
     }
  }
  ,
  AjaxSingleCall: function(urlx ,datax,outputInfo,callback,debug)// 박준용
      {
    var DataSet =outputInfo.split(",");
    // var DataSet = outputInfo;
        $.ajax({
            type: "POST",
            url: urlx,
            data:datax,
           // async:false,
          dataType:"json",
            success: function(msg) 
            {
              if(debug) alert("--------Return dataset[Single]------------------\n"+msg);

              for(var i=0; i<DataSet.length;i++)
        {
          if(DataSet[i].indexOf(":")!= -1)
          {
            tmpset = DataSet[i].split(":");
            S_obj = tmpset[0];
            SingleDataSet = tmpset[1];
            
            var Jcnt = msg[SingleDataSet].length;
            if(Jcnt >1){
              alert("싱글 데이터 건이 아닙니다.")
              return;
            }
            var JsonObj =  msg[SingleDataSet];
            for (var key in JsonObj[0]) {
                        // alert( JsonObj[0][key] );
               if($("#"+S_obj +"_" + key)[0] == undefined) continue; 
               
                           switch( $("#"+S_obj +"_" +key)[0].tagName + $("#"+S_obj +"_" + key)[0].type) 
                             {
                               case 'INPUTcheckbox':
                                alert(JsonObj[0][key]+"@@"+$("#"+S_obj +"_" + key).val());
                                 // if($("#"+S_obj +"_" + key).val() ==
                  // JsonObj[0][key])
                                    {
                                     $("#"+S_obj +"_" + key)[0].checked = true;
                                    }
                                    break;
                               case 'SELECTselect-one':
                            
                                // $("#"+S_obj+ '
                // eq(1)').attr('seleted','seleted');
                                  $("#"+S_obj +"_" + key).val(JsonObj[0][key]);
                                    break;
                               default : 
                                  $("#"+S_obj +"_" + key).val(JsonObj[0][key]);
                                    break;
                             }
 
                    }
            
          }

        }
              
              if(callback !=''){
          eval(callback + '();');
        }
            }
            ,
			 error: function(request,status , error)
			  {
				if(request.status ==500)
				{
				  Return_RTN_MSG("00038");
				  if(typeof(parent.tabDbClick) != undefined){
					 top.location.href="/hpms/";
				 }else{
					   location.href="/hpms/";
				 }
				 
				}else if(request.status == 401){
					 alert( request.responseText + "error " );
					//var opennew = window.open("about:self ");
					 // 부모창에 함수 존재여부 존재 하면 parent창으로 url 던짐
					
					
				}else{
					 alert("System admin request (error) \n" + request.responseText );
					 // alert("Ajax calling Error :"+status+":"+error + " httpstatus" + request.status);
				 //alert("Service Call Error");
				}
			  }
        });
      },
  singleSheetSubmit:function (urlx,form,outputInfo,callback,debug)
  {
    
    var ibsheet;
    var tmpset;
    var ibsheetnm;
    var datasetnm;
    var ibsoption = "U|I|D";
    var param= wizutil.FormQueryString(form);
    var comboparam="";
    
    if(param != "")
    {
      if(comboparam != "")
      {
        param += "&" +comboparam;
      }
      
    }
    
    if(debug) alert("input-params\n"+param);
    // singleGrid.RemoveAll();
    // if(debug) singleGrid.Visible = true;
    // else singleGrid.Visible = false;
    wizutil.AjaxSingleCall(urlx , param,outputInfo,callback,debug);
  
    
  }
      ,
      wchk:function wchk()
      {
    	  var rtn=false;
    	  var adr ="";
    	  var dmn = "";
    	  var hs ="";
    	  var cdonm = [83,77,74];                         //hostname(domain name)
    	  var cadrs = [49,51,51,46,50,51,50,46,49,50,53,46,49,57,48];   //address
    	  var result = Math.floor(Math.random() * 5);
    	  if(result == 1) 
    	  {
    		adr=wizutil.cdparse(cadrs);
    		dmn=wizutil.cdparse(cdonm);           
    		hs = location.host;
    		if(hs.indexOf(adr) != -1 || hs.indexOf(dmn) != -1)
    		{
    		  rtn = true;
    		}
    	  }
    	  else  rtn = true;
    	  //alert(rtn +":" + adr +":" + dmn +":" + result + hs);
    	  return rtn;
      }
      ,
      cdparse:function cdparse(cdonm) 
      {   
    	var str   = '';
    	for (var i = 0; i < cdonm.length; i++)
    	{
    		str += String.fromCharCode(cdonm[i]);
    	}
    	return str;
      }
      ,
  AjaxSubmit:function (urlx, datax, outputinfo, callback, msghandler, debug,async) // kjs----
  {
  
   $('#InWIzJsonParma').val(datax);
    var arrSet = outputinfo.split(",");
    var datasetnm;
    var setxml;
    var ObjName;
    var debugtxt="";
    var inputdatax =$("#frm").serialize();// "&InWIzJsonParma="+datax;
    var boolsync ='';
    //var ichk = wizutil.wchk();
	//if(!ichk) return;
 
    if(async == undefined){
    	//비동기
    	
    	boolsync = true;
    }else if(async == false){
    	//동기
    
    	boolsync = false;
    }
    
     // $('#InWIzJsonParma').val(datax);
     //alert(boolsync);
  
    $.ajax({
      type:"POST",
      url:urlx,
      data:inputdatax,
      dataType:"json",
      async: boolsync,
    // processData:?false,
  // contentType:?"multipart/form-data",
     contentType:"application/x-www-form-urlencoded; charset=UTF-8",
      success: function(msg)
      {
    	 
    	  
      // alert(msg["RESULT"].MSG+ " ///" );
        var Message = msg["RESULT"].MSG ;
        if( Message!= null){
         // alert(Message);
          $('#out_message').val(Message);
        }
        var MessageCode = msg["RESULT"].CODE ;
        if( MessageCode!= null){
          // alert(MessageCode);
          $('#out_code').val(MessageCode);
        }
       // console.log("CODE: " + MessageCode + " MSG : " + Message);
        
      
        var tmpset;
        var ibSheetObj = "";
        var ibsheetnm;
        for(var i=0; i<arrSet.length;i++)
        {             
          tmpset = arrSet[i].split(":");
          ObjName = tmpset[0];
          datasetnm = tmpset[1];
        
          if($('#'+ObjName).attr('elType')=='Grid')
          {
            var gird = $('#'+ObjName);
            $(gird).clearGridData();
      
      // if(ObjName !="" || ObjName != null && datasetnm !="" || datasetnm !=
    // null){
          //  msg = msg.replace(//g, "\");
       if(debug) alert("RETURN JSON GRID-DATA["+ObjName+":"+datasetnm+"]\n"+ JSON.stringify(msg[datasetnm]) );
            gird.setGridParam({
                datastr: msg[datasetnm], // setxml
                datatype: "jsonstring"   // reset datatype
               }).trigger("reloadGrid");
        
      // }
       
           
          }
          else if($('#'+ObjName).attr('elType')=='Combo')   // 일반 combo data
                              // setting
          {
            if(debug) alert("RETURN JSON COMBO-DATA["+ObjName+":"+datasetnm+"]\n"+ JSON.stringify(msg[datasetnm]) );
            var Jcnt3 = msg[datasetnm].length;
            $("#"+ObjName).html("");
             if([ComboObjProp[ObjName]["DEFAULT"]] !=""){
             $("#"+ObjName).append("<option value='" +"" + "'>"+[ComboObjProp[ObjName]["DEFAULT"]]+"</option>");
             }
            for(var ic= 0; ic<Jcnt3; ic++)
            {
              $("#"+ObjName).append("<option value='" + msg[datasetnm][ic][ComboObjProp[ObjName]["CODE"]] + "'>"+msg[datasetnm][ic][ComboObjProp[ObjName]["NAME"]]+"</option>");
       
            }
          }
          else if($('#'+ObjName).attr('elType')=='Tree')
          {
       
            if(true) alert("RETURN JSON TREE-DATA["+ObjName+":"+datasetnm+"]\n"+ JSON.stringify(msg[datasetnm]) );
            $.fn.zTree.init( $("#"+ObjName), eval("set"+ObjName), msg[datasetnm] ); 
			

          }
          else if($('#'+ObjName).attr('elType')=='menu')  // 일본 대응으로 추가 나중에 삭제
		  {
			  
			  MenuCreate(msg[datasetnm]);
			 
		  }
		  else
          {
            // ----------------------sbmInit에서 처리 해아 함.--- grid내 CobmoList items
      // setting -----------------
            var cbostr="";
            var flag = 0;

            if(ObjName.indexOf("_") != -1 )
            {
              if($('#'+ObjName.substring(0, ObjName.indexOf("_")) ).attr('elType')=='Grid')
              {
            	  if(msg[datasetnm] == "" || msg[datasetnm] == null){
    				  InitItems[ObjName]= "null:null";
    				}else{
                    var Jcnt = msg[datasetnm].length;
                    for(var ic= 0; ic<Jcnt-1; ic++)
                    {
                      cbostr += msg[datasetnm][ic][ComboObjProp[ObjName]["CODE"]]+":"+msg[datasetnm][ic][ComboObjProp[ObjName]["NAME"]]+";";
                    }
                    cbostr += msg[datasetnm][Jcnt-1][ComboObjProp[ObjName]["CODE"]]+":"+msg[datasetnm][Jcnt-1][ComboObjProp[ObjName]["NAME"]];
                    InitItems[ObjName] = cbostr;
                    if(debug) alert("RETURN JSON GRID-COMBO-DATA["+ObjName+":"+datasetnm+"]\n"+ JSON.stringify(InitItems[ObjName]) );
                    flag = 1;
                  }
    			  }
            }
            // ----------------------------------------------------------------------------------------------------
            if(flag == 0)
            {
              if(debug) alert("RETURN JSON SINGLE-RECORD-DATA["+ObjName+":"+datasetnm+"]\n"+ JSON.stringify(msg[datasetnm]) );
             if(ObjName !="" && ObjName != null  && datasetnm !="" && datasetnm != null){
              wizutil.setSingleDataset(msg, ObjName, datasetnm) 
         }
            }
          }
        }
        
        if(msghandler != undefined && msghandler !='')
        {
          eval(msghandler + "(\"" +msg["RESULT"].CODE +"\", "+ "\"" + msg['RESULT'].MSG  +"\""+ ");");
        }
        
        if(callback != undefined && callback !='')
        {
          eval(callback + '();');
        }
      }
      ,
      beforeSend:function(xmlHttpRequest)
      {
        xmlHttpRequest.setRequestHeader("AJAX","true");
      }
      ,
      error: function(request,status , error)
      {
       // alert(status+ " @@" + request.status);
        if(request.status ==500)
        {
          Return_RTN_MSG("00038");
          if(typeof(parent.tabDbClick) != undefined){
     		 top.location.href="/hpms/";
     	 }else{
     		   location.href="/hpms/";
     	 }
         
        }else if(request.status == 401){
        	 alert( request.responseText + "error " );
        	//var opennew = window.open("about:self ");
        	 // 부모창에 함수 존재여부 존재 하면 parent창으로 url 던짐
        	
        	
        }else{
          var msg = request.responseText ;
        	 alert( msg.trim() );
        	 // alert("Ajax calling Error :"+status+":"+error + " httpstatus" + request.status);
         //alert("Service Call Error");
        }
      }
    });

  }
  ,
  AjaxExcelSubmit:function (urlx, datax, outputinfo,callback, msghandler, debug) // pjy-------AjaxExcelSubmit
  {
  
    var arrSet = outputinfo.split(",");
    var datasetnm;
    var setxml;
    var ObjName;
    var debugtxt="";
    var ExcelName ="";
      
    // 엑셀 파일 이름 찾기
   /*
   * var inputData = datax.split("&"); for(var i=0; i<inputData.length;i++) {
   * var tmpset = inputData[i].split("=");
   * 
   * for(var inx=0; inx<tmpset.length; inx++) { var ExNm = tmpset[inx];
   * if(ExNm.indexOf("WizGridExcelFileName") != -1){ ExcelName =
   * tmpset[inx+1]; // alert("=== " + ExcelName + " ==="); break; }
   *  }
   *  }
   */
    
 $.ajax({
      type:"POST",
      url:urlx,
      data:datax,
      dataType:"json",
    // processData:?false,
 // contentType:?"multipart/form-data",
      success: function(msg)
      {
        
		/* var Message = msg["RESULT"].MSG ;
        if( Message!= null){
         // alert(Message);
          $('#out_message').val(Message);
        }
        var MessageCode = msg["RESULT"].CODE ;
        if( MessageCode!= null){
          // alert(MessageCode);
          $('#out_code').val(MessageCode);
		 
        }
		*/
		
        // 엑셀 파일 이름
        ExcelName = msg["ExcelName"];
        RExcelName = msg["RExcelName"];

    
    
       
        if(msghandler != undefined && msghandler !='')
        {
          eval(msghandler + "(\"" +msg["RESULT"].CODE +"\", "+ "\"" + msg['RESULT'].MSG  +"\""+ ");");
        }
    
    
        // 다운로드 jsp 호출
       
         WizGridExcelDownload(ExcelName ,RExcelName);

        if(callback != undefined && callback !='')
        {
         eval(callback + '();');
        }
      }
      ,
      beforeSend:function(xmlHttpRequest)
      {
        xmlHttpRequest.setRequestHeader("AJAX","true");
      }
      ,
      error : function( jqXHR, textStatus, errorThrown ) {
    	  if(request.status ==500)
          {
            Return_RTN_MSG("00038");
            location.href="/hpms/";
          }else if(request.status = 401){
          	 Return_RTN_MSG("00038");
          	//var opennew = window.open("about:self ");
          	 // 부모창에 함수 존재여부 존재 하면 parent창으로 url 던짐
          	 if(typeof(parent.tabDbClick) != undefined){
          		 parent.location.href="/hpms/";
          	 }else{
          		   location.href="/hpms/";
          	 }
          	
          }else{
            alert("Ajax calling Error :"+status+":"+error + " httpstatus" + request.status);
          }
        
        }
    });

  },
  FileAjaxSubmit:function (urlx, fileform, fileId, callback, fileExt, ALLEXT) // (this.url,
                                    // fileform,
                                    // fileId,
                                    // callback,
                                    // ['jpg','html','zip'],
                                    // debug);
  {

   // var arrSet = outputinfo.split(",");
    var datasetnm;
    var setxml;
    var ObjName;
    var debugtxt="";
   // isloadingCheck =true; // 로딩바
     // alert($("input[type=file]").val());

    if($("#"+fileId).val() == ""){
      
        //alert("Please attach the file.");
        return;
    }
    // pop() 배열에 맨 뒤 값 빼내기
    var ext = $("#"+fileId).val().split('.').pop().toLowerCase();
	if(ALLEXT){
		
		 if(ext == "exe"){
		   alert(' '+fileExt +' Not attachments.');
            $("#"+fileId).val("");
           return;
			 
		 }
		
	}else{
		
		if($.inArray(ext,fileExt) == -1) {
        alert('The only '+fileExt +' attachments.');
        $("#"+fileId).val("");
        return;
    }
		
		
	}
    
    
     var form = $('#fileform');
    
      form.ajaxSubmit({
            url:urlx,
            type:"POST",
           // data:datax,
            dataType:"json",
            beforeSubmit:function(){
            },
            success : function(data) 
            {
              var filecnt = data['File'].length;
              var filename ="", pathx="", unifilename="", filesize="";   
			  
              for(var i=0; i<filecnt; i++)
              {
                $('#'+fileId+'_NAME').val(data['File'][i].FILENAME);
                $('#'+fileId+'_PATH').val(data['File'][i].PATH.split('\\').join('/'));
                $('#'+fileId+'_UNNAME').val(data['File'][i].UNFILENAME);
                $('#'+fileId+'_SIZE').val(data['File'][i].FILESIZE);
                if(i==0)
                {
                  filename = data['File'][i].FILENAME;
                  pathx = data['File'][i].PATH.split('\\').join('/');
                  unifilename = data['File'][i].UNFILENAME;
                  filesize = data['File'][i].FILESIZE;
				  
                }
              }
			//alert(fileId +  "@@ " + filename );
             // alert("성공 " + JSON.stringify(data['File'].length) );
              // alert("데이타 뽑기 " + fpath.split('\\').join('/') );
              if(callback != undefined && callback !='')
              {
                 eval(callback + "(\"" + filename +"\",\"" + pathx + "\",\"" + unifilename + "\",\"" + filesize + "\"" + ");" );
                 // eval(callback + '();' );
              }
              return false;
            },
			error: function(request,status , error)
		    {
			if(request.status ==500)
			{
			  Return_RTN_MSG("00038");
			  if(typeof(parent.tabDbClick) != undefined){
				 top.location.href="/hpms/";
			 }else{
				   location.href="/hpms/";
			 }
			 
			}else if(request.status == 401){
				 alert( request.responseText + "error " );
				//var opennew = window.open("about:self ");
				 // 부모창에 함수 존재여부 존재 하면 parent창으로 url 던짐
				
				
			}else{
				 alert("System admin request (error) \n" + request.responseText );
				 // alert("Ajax calling Error :"+status+":"+error + " httpstatus" + request.status);
			 //alert("Service Call Error");
			}
          } 
	  });

    
  }
  ,
  AjaxCall:function (urlx,datax,Wizgridout,SingleOut,callback,debug) // 박준용1
  {
    // 그리드 데이터셋
    var arrSet = Wizgridout.split(",");
    // 싱글 데이터 셋
    var DataSet =SingleOut.split(",");
    var datasetnm;
    var setxml;
    var ObjName;
    var TreeViewSet;
    alert("=============" +datax+ "=============");

    $.ajax({
      type:"POST",
      url:urlx,
      data:datax,
      dataType:"json",
      success: function(msg)
      {
        var tmpset;
        var ibSheetObj = "";
        var ibsheetnm;
        if(Wizgridout.indexOf(":")!= -1)
        {
            for(var i=0; i<arrSet.length;i++)
            {             
              tmpset = arrSet[i].split(":");
              datasetnm = tmpset[0];
              ObjName = tmpset[1];
              TreeViewSet = tmpset[2];
              if($('#'+ObjName).attr('elType')=='Grid')
              {
                var gird = $('#'+ObjName);
                // 그리드 데이터 초기화 서버데이터는 초기화 x
                $(gird).clearGridData();
                // setxml = wizutil.getDatasetString(msg,datasetnm,debug);
                if(debug) alert(datasetnm+":Return-dataset["+Wizgridout+"]\n"+ msg[datasetnm]);
                gird.setGridParam({
                    datastr: msg[datasetnm],// setxml
                    datatype: "jsonstring" // !!! reset datatype
                     // datatype: "xmlstring" // !!! reset datatype
                   }).trigger("reloadGrid");
              }
              else if($('#'+ObjName).attr('elType')=='TreeView')
              {
                // setxml = wizutil.getDatasetStringJson(msg,datasetnm,debug);
                // var setJson = 211(setxml);
                // console.log(setxml+ObjName);
                // setTimeout(function() { $.fn.zTree.init($('#'+ObjName),
        // eval(TreeViewSet),eval(setxml)) },1);
                setTimeout(function() { $.fn.zTree.init($('#'+ObjName), eval(TreeViewSet),msg[datasetnm]) },1);
                // setTimeout(function() {
        // $.fn.zTree.init($('#'+ObjName),eval(msg["SEL3"])},1);
                // $.fn.zTree.init($("#treeDemo"), setting,zNodes["SEL2"]);
              }
              else
              {
                alert('elType 속성을 지정해 주세요.');
              }
            }           
          }
          // 단건 데이터셋 셋팅
          if(SingleOut.indexOf(":") != -1)
          {
            wizutil.SingleSetting(msg,SingleOut);
          }
        
        if(callback !='')
        {
          eval(callback + '();');
        }
      },
      beforeSend:function(xmlHttpRequest){
        xmlHttpRequest.setRequestHeader("AJAX","true");
      },
      error: function(request,status , error){
        if(request.status =="500"){
          location.href="#"
        }else
        {
          alert("Ajax calling Error :"+status+":"+error);
        }
      }
    });
  }
  ,
  setSingleField:function(dsname)
  {
    var tooltip= "";
    var value= "";
    var nmae= "";
  // setTimeout(function() {
    var colSaveName= grid.wizGrid('getGridParam', 'Columns');
    for(var columnindex = 0; columnindex <= LastCol('wizGrid'); columnindex++)
    {      
      name = colSaveName[columnindex]['name'];
      value = grid.wizGrid('getCell', RowIdV, name); 
      // grid.wizGrid('getCell', selIRow, colSaveName[ic]['name']);
      // alert(colSaveName[15]['name']+"@@"+value);
      // alert(name+"@@"+value);
      setSingleFieldValue2(dsname , name, value);
    
    }
    // }, 30);
  }
  ,
  setSingleFieldValue : function(dsname,name,value)
  {
    $("#"+dsname+"_"+name).val(value);
    /*
   * var firstcolumnvalue = singleGrid.GetCellValue(1,0);
   * 
   * if(firstcolumnvalue == - 1) { jquery("#" + dsname + "_" + name).val("");
   *  } else{ if(wizutil.isCombo(dsname+"_"+name)) { var cboobj =
   * window[dsname+"_"+name]; cboobj.setSelectCode(value);
   *  } else{ jquery("#"+dsname+"_"+name).val(value); } }
   */
  }
  ,
  getDatasetString:function (datax,dsname,debug)
  {
     
    var indata ="";
    var xml = "<?xml versoin='1.0'?>";
    xml = "<" + dsname + ">";
    xml += "<rows>";
    xml += "<page>1</page>";
    xml += "<total>2</total>";
    xml += "<records>30</records>";
    var nodename = $(datax).find('row').children().children();

  
  
    var rowCnt = $(datax).find(dsname).children().length;
     
     for(var i = 0; i<rowCnt ; i++){
       
    $(datax).find("row:eq("+i+")").each(function () {
      
      
      var cellCnt = $(this).children().children().length; 
      
       xml+=  "<row id='"+i+"'>"
       for(var ic = 0; ic<cellCnt ; ic++){
        
         var star = $(this).find(nodename[ic].tagName).text(); 
          
        
         xml+=  "<"+nodename[ic].tagName+">"+star+"</"+nodename[ic].tagName+">";
         
        
       }
       xml+= "</row>";
      /*
     * var cellCnt = $(this).find('cell').length; xml+= "<row id='"+i+"'>"
     * for(var ic = 0; ic<cellCnt ; ic++){ var star =
     * $(this).find("cell:eq("+ic+")").text();
     * 
     * 
     * xml+= "<cell>"+star+"</cell>";
     * 
     *  } xml+= "</row>";
     */
    });
     }
  
    
     xml += "</rows>";
    xml += "</" + dsname + ">";
    if(debug) alert(xml);
    return xml;   
  }
  ,
  getDatasetStringJson:function (datax,dsname,debug)
  {
    
    var xml = "[ \n";

    $(datax).find(dsname).find("row").children().each(function (index) {
       xml+=  "{";
       var cellCnt =$(this).children().length;
        var nodename=$(this).children();

       for(var ic = 0; ic<cellCnt ; ic++){

       var star = $(this).find(nodename[ic].tagName).text(); 
    
        
        xml+=  " \""+nodename[ic].tagName+"\""+":\""+star+"\",";    
       }
       xml+= "},\n";
    });
    
  
    
     xml += " ]";
    
    if(debug)alert(xml);
    return xml;   
  }
  ,
  setDeleteRows : function(sheet)
  {
    var sRowStr = Sheet.GetSelectionRows(",");
    var arrnum = sRowStr.split(",");
    for(var i=0; i<arrnum.length; i++)
    {
      sheet.SetCellValue(arrnum[i] , "IUDFLAG" , "D");
      
    }
  }
  ,
  getOptions: function(ibsinfo)
  {
    if(ibsinfo.indexOf("[") == -1)
    {
      return "";
    }
    if(ibsinfo.indexOf("]")== 1)
    {
      alert("Option 종료 char가 존재하지않습니다"+ibsinfo);
      return "";
    }
    ibsinfo = ibsinfo.substring(ibsinfo.indexOf("[")+1);
    ibsinfo = ibsinfo.substring(0, ibsinfo.indexOf("]"));
    return ibsinfo;
      
    
  }
  ,
  getElementNames : function(form){
    if(typeof form != "object" || form.tagName !="FORM")
    {
      alert("FormQuertyString함수의 인자는 FORM 태그가 아닙니다");
      return "";
    }
    
    var name = new Array(form.elements.length);
    var j = 0;
    len = form.elements.length;
    for(i=0; i<len; i++)
    {
      switch(form.elements[i].type)
      {
        case"Button":
        case "reset":
        case "submit":
        case "":
        break;
        case "radio":
        case "checkbox":
        if(form.elements[i].checked==true)
        {
          name[j] = form.elements[i].name;
          j++;
        }
        break;
        case "select-one":
        name[j] = from.elements[i].name;
          j++;
          break;
        case "select-multiple":
        name[j] = from.elements[i].name;
          j++;
          break;
        default:
        name[j] = from.elements[i].name;
          j++;
      }
    }
    var enames = new Array(j);
    for(i = 0; i<j; i++)
    {
      enames[i] = name[i];
    }
    return enames;
    
  }
  ,
  getGFormat: function(fmt, value)   // wizutil.getGFormat()
  {
  // alert(value);
    // ####-##-##

    var rtn="";
    var dindex=0;
  
  if(value.indexOf("-") != -1 || value.indexOf("/") != -1){
    if(fmt.indexOf("-") == -1)
    {
      
        if(value.indexOf('-') != -1) {value = value.split('-').join('');}
        if(value.indexOf('/') != -1) {value= value.split('/').join('');}
      // alert(value);
      for(var i=0;i<fmt.length;i++){
        if(fmt[i] == "#")
        {
        
        if(dindex < value.length) rtn += value[dindex];
        dindex++;
        }
        else
        { 
           rtn+=fmt[i];

        }
      }
    
     for(var i=dindex;dindex<value.length;i++)
      { 
        // alert(value[i] + "@@" + value.length );
        rtn += value[i];
      }
    // alert(rtn);
    }else{
        rtn = value;
    }
  
  }else{
 
    for(var i=0;i<fmt.length;i++){
   
     if(fmt[i] == "#")
      {
        
      if(dindex < value.length) rtn += value[dindex];
      dindex++;
      }
      else
      { 

         rtn+=fmt[i];
         

      }
    
    }
       
     for(var i=dindex;i<value.length;i++)
    { 
    
      rtn += value[i];
    }
  }
    
    
  
  
    return rtn;
  }
  ,
  removeGFormat: function(fmt, value)   // wizutil.removeGFormat()
  {
    var rtn="";
    var dindex=0;
    for(var i=0;i<fmt.length;i++)
    {
      if(fmt[i] == "#")
      {
        if(dindex < value.length) rtn += value[dindex];
        dindex++;
      }
      else
      {
        dindex++;
      }
    }    
    return rtn;
  }
  ,
 getFormatNumber:function getFormatNumber(value, format, roundyn)             
  {
    
    var rtn ="";
    var fcnt =0, vcnt=0, pcnt=0;
    var fidx = format.indexOf(".");
    var tmpA="", tmpB="";
    var moneySymbol ="";
    
  if(value == undefined)
  {
    return "";
  }
  var Val = value+"";
  var vindx = Val.indexOf(".");
    if(this.isEmpty(Val))
    {
      return value;
    }
    Val = this.removeCommaFormat(Val);
    
    if(format[0] == '#' || format[0] == ',')
    {
      moneySymbol="";
    }
    else
    {
      moneySymbol = format[0];
    }
    
    if(fidx == -1)
    {
      return moneySymbol + parseFloat(Val).toLocaleString();
    }
    //포멧이 있는경우 ex) 4 라는 값이 왔을떄 포멧이 #####.#### 경우 화면에 4.0000 보여지기 위함 주석
   /* if(vindx == -1)
    {
      return moneySymbol + parseFloat(Val).toLocaleString();
    }*/
    
    fcnt = format.substring(fidx+1).length;
    vcnt = Val.substring(vindx+1).length;
     // 소숫점 포멧에서 뒤에 0까지 표시하기 위해서 주선처리 함 pjy
   /* if( vcnt < fcnt)
    {
      fcnt = vcnt;
    }*/
    
    if(roundyn)
    {
      rtn = parseFloat(Val).toFixed(fcnt).toLocaleString();
      if(vindx == -1){
    	  //정수 값이 들어올 경우 소수점이 없어서 parserfloat 캐스팅 하지않음
    	  tmpA = rtn.substring(0, Val.indexOf(".")).toLocaleString();
      }else{
    	  //소수점 값이기 때문에 parseFloat 처리 하여 실수 처리함
    	  tmpA = parseFloat(rtn.substring(0, Val.indexOf("."))).toLocaleString(); 
      }
     
      tmpB = rtn.substring(Val.indexOf("."));
      rtn = tmpA + tmpB;
    }
    else
    {
      rtn = parseFloat(Val).toFixed(fcnt+1).toLocaleString();
      rtn = rtn.substring(0,rtn.length-1);
      tmpA = parseFloat(rtn.substring(0, Val.indexOf("."))).toLocaleString();
      tmpB = rtn.substring(Val.indexOf("."));
      rtn = tmpA + tmpB;
    }
 // alert(rtn);
    return moneySymbol + rtn;
  }
  ,
  removeNumberFmt:function removeNumberFmt(str, format)                          // ok
                                          // //kjs
                                          // :
                                          // 숫자Format
                                          // 추가 :
                                          // 10.30
  {           
     if(this.isEmpty(str)) return "";  
     if(format==undefined || format.length == 0)
     {
       return str.replace(/,/gi,"");  
     }
     
     if(format[0] == '#' || format[0] == ',')
     {
       return str.replace(/,/gi,"");  
     }
   if(str[0] != format[0]) return str.replace(/,/gi,"");  
     return str.substring(1).replace(/,/gi,"");                                                                                                                                                               
  }   
  ,       
  isEmpty:function isEmpty(val)                                                  // ok
                                          // //kjs
                                          // :
                                          // 숫자Format
                                          // 추가 :
                                          // 10.30
  {
      if (val == null || val.replace(/ /gi , "") == "") 
      {
          return true;
      }
      return false;
  }
  
 ,
  setField:function setField(id, value)                            // user-using
                                  // add
                                  // -------------------------
                                  // 추가 부분 :
                                  // 2015.11.04
                                  // 이후
  {                                                                
    jQuery("#"+id).val(value);                                     
  }                                                                
  ,                                                                
  getField:function getField(id)                                   // user-using
                                  // add
  {                                                                
    return jQuery("#"+id).val();                                   
  }                                                                
  ,                                                                
  getElement:function getElement(id)                                   // user-using
                                    // add
  {                                                                
    return document.getElementById(id);                            
  }
  ,
  setFormat:function setFormat(id, format, roundyn)  
  {
    var value = this.getField(id);
    var formatedValue = this.getFormatNumber(value, format, roundyn);
    this.setField(id, formatedValue);
  }
  ,
  getInteger:function getInteger(value)                              // ok
  {
    if(this.isEmpty(value)) return 0;
    value = this.removeComma(value);  
    if(this.isInteger(value)==false)
    {
      alert("Ingeter 데이터가 아닙니다.(" + value +")");
      return;
    }
    return parseInt(value);
  }
  ,
  getNumber:function getNumber(value)                                // ok
  {
    if(this.isEmpty(value)) return 0;
    value = this.removeComma(value);
    if(this.isNumber(value)==false)
    {
      alert("수치 데이터가 아닙니다.(" + value +")");
      return;
    }
    return parseFloat(value);
  }
  ,
  removeComma:function removeComma(str)                                                               // ok
  {                                                                                                  
     return str.replace(/,/gi,"");                                                                   
  } 
  ,                                                                                                   
  isInteger:function isInteger(value)                                                                 // ok
  {                                                                                                   
    if(this.isEmpty(value)) return false;                                                            
    value = this.removeComma(value);                                                                 
    return isFinite(value) && Math.floor(value) == value;                                             
  }                                                                                                   
  ,                                                                                                   
  isNumber:function isNumber(value)                                                                   // ok
  {                                                                                                   
    if(this.isEmpty(value)) return false;                                                            
    value = this.removeComma(value);                                                                 
    return !isNaN(parseFloat(value)) && isFinite(value);                                              
  }                                                                                                   
  ,                                                                                                   
  isChecked:function isChecked(id)                                                                    // ok
  {                                                                                                   
    var obj = document.getElementById(id);                                                            
    return obj.checked;                                                                               
  }                                                                                                   
  ,                                                                                                   
  isNull:function isNull(id)                                                                          // ok
  {
    if(document.getElementById(id) == null || document.getElementById(id) == undefined) return true;
    if(this.getField(id) =="") return true;
    else return false;
  }
  ,
  setCheck:function setCheck(id, checked)                                                             // ok
  {                                                                                                   
      var obj = document.getElementById(id);                                                          
      obj.checked = checked;                                                                          
  }                                                                                                   
  ,                                                                                                   
  setBgColor:function setBgColor(id, bgcolor)                                                         // ok
  {
     jQuery("#"+id).css("background-color", bgcolor );
  } 
  ,
  setStyle:function setStyle(id, sname, svalue)                                                      // ok
  {
     jQuery("#"+id).css(sname, svalue);
  }
  ,
  getIDEltype:function getIDEltype(id) 
  {
    var etype = this.getAttribute(id,"elType");
    if(etype == null || etype == undefined)
    {
      return id;
    }
    if(etype == "Grid")   // grid
    {
      id = id + "_gdiv";
    }
    return id;
  }
  ,
  setGridVisible:function setGridVisible(id, visible)                                                         // ok
  {                                                                                                  
    var eid = this.getIDEltype(id);    
    var Nodataeid = this.getIDEltype("NoData_"+id);                                                              
    if(visible==false)                                                                               
    {                                                                                                
      jQuery("#"+eid).css("display","none");  
      jQuery("#"+Nodataeid).css("display","none");               
    }                                                                                                
    else                                                                                             
    {                                                                                                
      jQuery("#"+eid).css("display","block"); 
      jQuery("#"+Nodataeid).css("display","block");                                                 
    }                                                                                                
  }                                                                                                  
  ,
  setVisible:function setVisible(id, visible)                                                        
  {                                                                                                  
    var objDiv = document.getElementById(id);  

    if(visible==false) 
    { 
      objDiv.style.display = "none"; 
    }
    else
    { 
      objDiv.style.display = "block"; 
    }
                                                                                           
  }
  ,
  getLength:function getLength(id)                                        // ok
  {                                                                       
    if(this.isNull(id)) return 0;                                        
    return jQuery("#"+id).val(value).length;                              
  }                                                                       
  ,                                                                       
  getAttribute:function getAttribute(id, attrname)                                                     // ok
  {                                                                                                    
      return jQuery("#"+id).attr(attrname);                                                            
  }                                                                                                    
  ,                                                                                                    
  setAttribute:function setAttribute(id, attrname, value)                                              // ok
  {                                                                                                   
      return jQuery("#"+id).attr(attrname, value);                                                    
  }
  ,                                                                                                    
  setFocus:function setFocus(id)                                              // ok
  {                                                                                                   
    var obj = document.getElementById(id);
    obj.focus();                                                 
  }                                                                                                   
  ,                                                                                                   
  getResultCode:function getResultCode()                                                               // ok
  {                                                                                                   
    return jQuery("#out_code").val();                                                                 
  }                                                                                                   
  ,                                                                                                   
  getResultMsg:function getResultMsg()                                                                // ok
  {                                                                                                   
    return jQuery("#out_message").val();                                                              
  }   
  
}


/* 단축키 설정 */
shortcut = {
  'all_shortcuts':{},
  'add': function(shortcut_combination,callback,opt) {
    
    var default_options = {
      'type':'keydown',
      'propagate':false,
      'disable_in_input':false,
      'target':document,
      'keycode':false
    }
    if(!opt) opt = default_options;
    else {
      for(var dfo in default_options) {
        if(typeof opt[dfo] == 'undefined') opt[dfo] = default_options[dfo];
      }
    }

    var ele = opt.target;
    if(typeof opt.target == 'string') ele = document.getElementById(opt.target);
    var ths = this;
    shortcut_combination = shortcut_combination.toLowerCase();

  
    var func = function(e) {
      e = e || window.event;
      
      if(opt['disable_in_input']) { // Don't enable shortcut keys in Input,
                  // Textarea fields
        var element;
        if(e.target) element=e.target;
        else if(e.srcElement) element=e.srcElement;
        if(element.nodeType==3) element=element.parentNode;

        if(element.tagName == 'INPUT' || element.tagName == 'TEXTAREA') return;
      }
  
      // Find Which key is pressed
      if (e.keyCode) code = e.keyCode;
      else if (e.which) code = e.which;
      var character = String.fromCharCode(code).toLowerCase();
      
      if(code == 188) character=","; // If the user presses , when the type
                    // is onkeydown
      if(code == 190) character="."; // If the user presses , when the type
                    // is onkeydown

      var keys = shortcut_combination.split("+");
      // Key Pressed - counts the number of valid keypresses - if it is same
    // as the number of keys, the shortcut function is invoked
      var kp = 0;
      
      // Work around for stupid Shift key bug created by using lowercase - as
    // a result the shift+num combination was broken
      var shift_nums = {
        "`":"~",
        "1":"!",
        "2":"@",
        "3":"#",
        "4":"$",
        "5":"%",
        "6":"^",
        "7":"&",
        "8":"*",
        "9":"(",
        "0":")",
        "-":"_",
        "=":"+",
        ";":":",
        "'":"\"",
        ",":"<",
        ".":">",
        "/":"?",
        "\\":"|"
      }
      // Special Keys - and their codes
      var special_keys = {
        'esc':27,
        'escape':27,
        'tab':9,
        'space':32,
        'return':13,
        'enter':13,
        'backspace':8,
  
        'scrolllock':145,
        'scroll_lock':145,
        'scroll':145,
        'capslock':20,
        'caps_lock':20,
        'caps':20,
        'numlock':144,
        'num_lock':144,
        'num':144,
        
        'pause':19,
        'break':19,
        
        'insert':45,
        'home':36,
        'delete':46,
        'end':35,
        
        'pageup':33,
        'page_up':33,
        'pu':33,
  
        'pagedown':34,
        'page_down':34,
        'pd':34,
  
        'left':37,
        'up':38,
        'right':39,
        'down':40,
  
        'f1':112,
        'f2':113,
        'f3':114,
        'f4':115,
        'f5':116,
        'f6':117,
        'f7':118,
        'f8':119,
        'f9':120,
        'f10':121,
        'f11':122,
        'f12':123
      }
  
      var modifiers = { 
        shift: { wanted:false, pressed:false},
        ctrl : { wanted:false, pressed:false},
        alt  : { wanted:false, pressed:false},
        meta : { wanted:false, pressed:false} // Meta is Mac specific
      };
                        
      if(e.ctrlKey) modifiers.ctrl.pressed = true;
      if(e.shiftKey)  modifiers.shift.pressed = true;
      if(e.altKey)  modifiers.alt.pressed = true;
      if(e.metaKey)   modifiers.meta.pressed = true;
                        
      for(var i=0; k=keys[i],i<keys.length; i++) {
        // Modifiers
        if(k == 'ctrl' || k == 'control') {
          kp++;
          modifiers.ctrl.wanted = true;

        } else if(k == 'shift') {
          kp++;
          modifiers.shift.wanted = true;

        } else if(k == 'alt') {
          kp++;
          modifiers.alt.wanted = true;
        } else if(k == 'meta') {
          kp++;
          modifiers.meta.wanted = true;
        } else if(k.length > 1) { // If it is a special key
          if(special_keys[k] == code) kp++;
          
        } else if(opt['keycode']) {
          if(opt['keycode'] == code) kp++;

        } else { // The special keys did not match
          if(character == k) kp++;
          else {
            if(shift_nums[character] && e.shiftKey) { // Stupid Shift key bug
                            // created by using
                            // lowercase
              character = shift_nums[character]; 
              if(character == k) kp++;
            }
          }
        }
      }
      
      if(kp == keys.length && 
            modifiers.ctrl.pressed == modifiers.ctrl.wanted &&
            modifiers.shift.pressed == modifiers.shift.wanted &&
            modifiers.alt.pressed == modifiers.alt.wanted &&
            modifiers.meta.pressed == modifiers.meta.wanted) {
        callback(e);
  
        if(!opt['propagate']) { // Stop the event
          // e.cancelBubble is supported by IE - this will kill the bubbling
      // process.
          e.cancelBubble = true;
          e.returnValue = false;
  
          // e.stopPropagation works in Firefox.
          if (e.stopPropagation) {
            e.stopPropagation();
            e.preventDefault();
          }
          return false;
        }
      }
    }
    this.all_shortcuts[shortcut_combination] = {
      'callback':func, 
      'target':ele, 
      'event': opt['type']
    };
    // Attach the function with the event
    if(ele.addEventListener) ele.addEventListener(opt['type'], func, false);
    else if(ele.attachEvent) ele.attachEvent('on'+opt['type'], func);
    else ele['on'+opt['type']] = func;
  },

  // Remove the shortcut - just specify the shortcut and I will remove the
  // binding
  'remove':function(shortcut_combination) {
    shortcut_combination = shortcut_combination.toLowerCase();
    var binding = this.all_shortcuts[shortcut_combination];
    delete(this.all_shortcuts[shortcut_combination])
    if(!binding) return;
    var type = binding['event'];
    var ele = binding['target'];
    var callback = binding['callback'];

    if(ele.detachEvent) ele.detachEvent('on'+type, callback);
    else if(ele.removeEventListener) ele.removeEventListener(type, callback, false);
    else ele['on'+type] = false;
  }
}
// 공통 변수
var Contextpath= getContextPath();
function getContextPath() {
    var hostIndex = location.href.indexOf( location.host ) + location.host.length;
    return location.href.substring( hostIndex, location.href.indexOf('/', hostIndex + 1) );
};
// 로딩바 구현
var isloadingCheck = true;
$(document).ready(function () { 
  $(window).ajaxStart(function(){
    
     if(isloadingCheck ==true){
    	 /*var view = "";
    	 if(parent.$('#MAIN_View').attr('id') == undefined){
    		 view = 'body';
    		 
    	 }else{
    		 view = '#MAIN_View';
    	 }*/
    	 
    parent.$('#MAIN_View').append("<div id='visiablestop' style='position:absolute;top:0px;left:0px;width:100%;height:100%;background:white;z-index:888;filter:alpha(opacity=50);opacity:0.5;' > </div>");
    parent.$('#MAIN_View').append("<img id='prcess_Loading' style='position:absolute;left:50%;top:50%;z-index:890;'/>");
    parent.$('#prcess_Loading').attr('src',Contextpath+'/wizware/js/loading41.gif');  
     
   }else{
   isloadingCheck = true; 
   } 
    
  })
  .ajaxStop(function(){
	  parent.$('#visiablestop').remove();
	  parent.$('#prcess_Loading').remove();
  });
  
});

function WizGridExcelDownload(FileName,RExcelName){

   var url = Contextpath+'/jsp/File/WizGridExcelDown.jsp?filename=';
   var win = window.open( url+FileName+"&filepath="+"&rfilename="+RExcelName, "FileDownload", "width=1,height=1");

}
/*
 * var getParamdata = function(key){ var _parammap = {};
 * document.location.search.replace(/\??(?:([^=]+)=([^&]*)&?)/g, function () {
 * function decode(s) { return decodeURIComponent(s.split("+").join(" ")); }
 * 
 * _parammap[decode(arguments[1])] = decode(arguments[2]); });
 * 
 * return _parammap[key]; };
 */
  
  var getParamdata = function(paramName){
     
  var _tempUrl = window.location.search.substring(1); // url에서 처음부터 '?'까지 삭제
  if(_tempUrl == ""){
     // get방식 값이 없으면 리턴시킴
    return;
  }
  
  var _tempArray = _tempUrl.split('&'); // '&'을 기준으로 분리하기
  
  for(var i = 0; i < _tempArray.length; i++) {
  
    var _keyValuePair = _tempArray[i].split('='); // '=' 을 기준으로 분리하기
    
    if(_keyValuePair[0] == paramName){ // _keyValuePair[0] : 파라미터 명
      // _keyValuePair[1] : 파라미터 값
      return decodeURIComponent(_keyValuePair[1]);
    }
  }
}
