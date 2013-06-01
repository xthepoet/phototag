
var scaleFactor = 0.5;
var snapshot = null;
var server_addr = 'http://ceeqapi.com';
var ceeq_key = '[get your own key]'; /* get from http://ceeqapi.com */
var display_height=500;


/* Post photo to CeeQAPI (http://ceeqapi.com) for face detection */
function upload(photo_url)
{
    console.log(photo_url);
    $('#loader_image').show();
    $( "#photos" ).show().html( '<div class="PhotoCell--photoWrapper"><img src="' + photo_url + '" height="500px"></div>');
    $.ajax( {
           url: server_addr + '/api/photos/',
           type: 'POST',
           data: {'photo_source_url':photo_url},
           headers: {'Authorization':ceeq_key},
           dataType: 'json',
           success: function( data )
           {
            console.info('success');
            console.info(data);
           ratio = display_height/data.height;
            for(var i=0;i<data.faces.length;i++){
                //draw face (optional; element may have to be passed in)
                var top = data.height*data.faces[i].face_tly*ratio;
                var left = data.width*data.faces[i].face_tlx*ratio;
                var width = data.width*data.faces[i].face_width*ratio;
                var height = data.height*data.faces[i].face_height*ratio;
                var stylestr = "height:"+height+"px;width:"+width+"px;top:"+top+"px;left:"+left+"px"
                $( ".PhotoCell--photoWrapper" ).append('<div class="PhotoCell--tag" style="'+stylestr+';" data-face="'+data.faces[i].face_id+'"></div>');
                face_classify(data.faces[i].face_id, top+height+5, left+5);
            }
            //$('#loader_image').hide();
           },
           error: function(data)
           {
            console.info('error');
            console.info(data);
            $('#loader_image').hide();
           },
    } );
}

/* Get face meta data CeeQAPI (http://ceeqapi.com) */
function face_classify(face_id, top, left)
{
    console.log(face_id);
    $('#loader_image').show();
    $.ajax( {
           url: server_addr + '/api/photos/classify/face/'+face_id+'/',
           type: 'POST',
           data: null,
           headers: {'Authorization':ceeq_key},
           dataType: 'json',
           success: function( data )
           {
           console.info('success');
           console.info(data);
           //find the relevant meta data
           var stylestr = "top:"+top+"px;left:"+left+"px";
           var metastr = "";
           for(var i=0;i<data.meta.length;i++){
           if (data.meta[i].gender) {
             metastr = metastr + data.meta[i].gender + "<br/>";
           }
           else if (data.meta[i].age) {
           metastr = metastr + data.meta[i].age + "<br/>";
           }
           }
           $( ".PhotoCell--photoWrapper" ).append('<div class="PhotoCell--meta" style="'+stylestr+';">'+metastr+'</div>');
           $('#loader_image').hide();
           },
           error: function(data)
           {
           console.info('error');
           console.info(data);
           $('#loader_image').hide();
           },
           } );

}
