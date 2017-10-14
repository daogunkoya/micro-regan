/* Javascript ment.getElementsByTagName('table')[0],
    rows = table.getElementsByTagName('tr'),
    text = 'innerText';

for (var i = 0, len = rows.length; i < len; i++){
    rows[i].children[0][text] = i + '. ' + rows[i].children[0][text];
} */

/* Javascript enbds here */

$(function() {

//delete expense
$('a.delete-expense').on('click', function(){
   
    id = $(this).attr('data-id')
     console.log('id to delete='+ id)
     if(confirm('Are you sure you want to delete this expense')){
            $.ajax({
                method:"DELETE",
                url:'/admin/deletexpense',
                data:{id:id},
                success:function(response){ 
                    window.location.reload(true)
                },
                error:function(err){
                    console.log(err)
                }
            })
     }
})
//delete member
$('a.delete-member').on('click', function(){
    id = $(this).attr('data-id')
    $.ajax({
        method:"DELETE",
        url:'/members/deletemember',
        data:{id:id},
        success:function(response){ 
            window.location.reload(true)
        },
        error:function(err){
            console.log(err)
        }
    })
})
//group post delete
$('a.delete-group').on( 'click', function(){
    var id = $(this).attr('data-id');
    //alert('am clicked');
    $.ajax({
        method : "DELETE",
        url :"/groups/deletegroup/"+id,
        data:{id: id},
        success: function(result){
            console.log(result)
            window.location.reload(true)
        },
        error:function(err){
            console.log(err)
        }
    })


})

//delete Loan

$('a.delete-loan').on('click', function(){
    id = $(this).attr('data-id')
    $.ajax({
        method:'DELETE',
        url:'/members/loan/delete',
        data:{id:id},
        success:function(data){
            console.log(data)
            window.location.reload(true)
        },
        error:function(err){
                console.log(err)
            }
    })
})
//delete repayment
$('a.delete-repayment'). on('click', function(){
    id = $(this).attr('data-id')
    $.ajax({
        method:"DELETE",
        url: "/members/repayment/delete",
        data:{id:id},
        success:function(data){
            console.log(data)
            window.location.reload(true)
        },
        error:function(err){
            console.log(err)
        }
    })
})
//confirm repayment
$('a.confirm-repayment'). on('click', function(){
    id = $(this).attr('data-id')
    $.ajax({
        method:"POST",
        url: "/members/repayment/confirm",
        data:{id:id},
        success:function(data){
            console.log(data)
            window.location.reload(true)
        },
        error:function(err){
            console.log(err)
        }
    })
})

//confirm loan
$('a.confirm-loan').on('click', function(){
    var id = $(this).attr('data-id')
    var value = $(this).attr('data-value')
    $.ajax({
        method:'POST',
        url:'/members/loan/confirm',
        data:{id:id,value:value},
        success:function(data){
            console.log("id = " + id + " value =" + value)
           window.location.reload(true)
        },
        error:function(err){
            console.log(err)
        }

    })
})

//finished or complete loan
$('a.finished-loan').on('click', function(){
    var loanid = $(this).attr('data-loanid')
    var loan = 0
    var memberid = $(this).attr('data-memberid')
    var status = $(this).attr('data-stage')
    
    status = status=='onGoing'?'completed':'onGoing'
    console.log('memberid = '+ memberid + 'loanid='+ loanid + 'loan='+ loan + 'status='+ status )
    $.ajax({
        method:'POST',
        url:'/officers/repayment/finished',
        data:{memberid:memberid,loanid:loanid,loan:loan,status:status},
        success:function(data){
            console.log("data.status " + data.status)
           window.location.reload(true)
        },
        error:function(err){
            console.log(err)
        }

    })
})

//autocomplete
$("#searchmember").autocomplete({
    max:10,
    source: function(request,response){
        $.ajax({
            url:"/members/searchmember",
            data:{term:request.term},
            method:"POST",
            dataType:"json",
            success:response,
            error:function(){
                response([])  
            }
        })
    
    },
    select:function(event, ui){
       window.location.href="/members/searchmember/" + ui.item.value
    }      
})

    $("#dateFrom").datepicker({
    // Show month dropdown
    changeMonth: true,
    // Show year dropdown
    changeYear: true,
    dateFormat: "yy-mm-dd",
    // Number of months to display
    numberOfMonths: 1,
    // Define maxDate
    maxDate: 365,
    // Define minDate
    minDate: -3650
  });

    $("#dateTo").datepicker({
    // Show month dropdown
    changeMonth: true,
    // Show year dropdown
    changeYear: true,
     dateFormat: "yy-mm-dd",
    // Number of months to display
    numberOfMonths: 1,
    // Define maxDate
    maxDate: 365,
    // Define minDate
    minDate: -3650
  });
    
});
