$(function(){
    $('.del').click(function(e){
        var target = $(e.target);
        var id = target.data('id');
        var tr = $('.item-id-'+id);
        // console.log('target',target);
        // console.log(id);
        
        $.ajax({
            type:'DELETE',
            url:'/admin/list?id='+id
        }).done(function(results){
            console.log('results:',results);
            if(results.success===1){//删除成功
                console.log(tr.length);
                if(tr.length>0){
                    tr.remove();
                }
            }
            else{
                alert('删除失败');
            }
        });









    })

});