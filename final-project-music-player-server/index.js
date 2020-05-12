'use strict'
//require cors and database file for connection
var cors = require('cors')
var DB   = require('./src/database')

//use express
var express = require('express');
var app     = express();
app.use(express.static(__dirname + '/public'));
app.use(cors())

app.use(express.urlencoded());  //Parse URL-encoded bodies
app.use(express.json());        //Used to parse JSON bodies

//Database connection
DB.connect()

// get all playlists
app.get('/playlists',
    function(request,response){
        DB.query("select * from playlist order by id asc",[],
            function(results){
                var html_string=JSON.stringify(results.rows)
                //console.log(html_string)
                response.send(html_string)
            }
        )
    }
)

// get all tracks
app.get('/tracks',
    function(request,response){
        var display_html = '';
        DB.query("select * from track order by id asc",[],
            function(results){
                var html_string=JSON.stringify(results.rows)
                console.log(html_string)
                display_html += '<div class="limiter">';
                display_html += '<div class="container-table100">';
                display_html += '<div class="wrap-table100">';
                display_html += '<div class="table100">';
                display_html += '<table><thead><tr class="table100-head"><th class="column2">Title</th><th class="column2">PlayList Id</th><th class="column3">Master Id</th><th class="column4">Action</th>';
                display_html += '</tr></thead><tbody>';
                results.rows.forEach(element => {
                    display_html +='<tr>';
                    display_html +='<td class="column2">'+element.title+'</td>';
                    display_html +='<td class="column2">'+element.playlist_id+'</td>';
                    display_html +='<td class="column3">'+element.master_id+'</td>';
                    display_html +='<td class="column4">';
                    display_html +='| <a href=/tracks/'+element.id+'>View</a>';
                    display_html +='| <button onClick="deleteTrack('+element.id+')">Delete</button></td>';
                    display_html +='</tr>';

                });
                display_html +='</tbody></table></div></div></div></div></div>';
                response.set('Content-Type' , 'text/html')
                response.send(display_html)
            }
        )
    }
)

//get 1 track
// passing parameter thru the URL example: http://localhost:3030/tracks/2
app.get('/tracks/:id',
    function(request,response){
        var display_track = '';
        DB.query("select * from track where id=$1 ",[request.params.id],
            function(results){
                if(results.rowCount==1)
                {
                    var output = {}
                    output.message = "OK"
                    output.data = results.rows
                     display_track +='<div>';
                     display_track +='<label>Id : <label>'+results.rows[0].id+'<br>'
                     display_track +='<label>Playlist Id : <label>'+results.rows[0].playlist_id+'<br>'
                     display_track +='<label>Title : <label>'+results.rows[0].title+'<br>'
                     display_track +='<label>Master Id : <label>'+results.rows[0].master_id+'<br>'
                     display_track += '</div>';
                     response.set('Content-Type' , 'text/html')
                     response.send(display_track)
                }
                else{
                    // tell the client I'm sending out a html code
                    response.set('Content-Type' , 'text/html')
                    response.status(404).send("track id "+request.params.id+" not found !!!!")
                }
            }
        )
    }
)

function deleteTrack(trackId){
    console.log(trackId);
    // delete 1 track
    app.delete('/tracks/:id',
        function(request,response){
            DB.query("DELETE from track where id=$1",[trackId],
                function(results){
                    if(results.rowCount==1)
                    {
                        var output = {}
                        output.message = "OK"
                        output.data = results.rows
                        var html_string=JSON.stringify(output)
                        console.log(html_string)
                        // tell the client I'm sending out a javascript object
                        // in the form of a string
                        response.set('Content-Type' , 'text/html')
                        response.status(200).send(html_string)
                    }
                    else{
                        // tell the client I'm sending out a html code
                        response.set('Content-Type' , 'text/html')
                        response.status(404).send("<b>track id "+request.params.id+" not found !</b>")
                    }
                }
            )
            //response.send("this is the DELETE reply")
        }
    )
}

//Update 1 track
app.put('/tracks/:id',
    function(request, response){
        console.log(request.params.id);
        console.log(request.params.playlist_id); ///??????????????
        console.log(request.body.title)// these are the form inputs
        console.log(request.body.uri)
        console.log(request.body.master_id)
        DB.query('UPDATE track SET playlist_id=$1 title=$2, uri=$3 master_id=$4 WHERE id=$5',
        [request.body.playlist_id, request.body.title, request.body.uri, request.body.master_id, request.params.id],
            function(results){
                var html_str = JSON.stringify(results.rows)
                console.log(html_str)
                response.send(html_str)
            }
        )
        //response.send("this is the put reply")
    }
)

// create / insert 1 new track
// to test make a form with <form action="/" method="POST">.......
app.post('/tracks',
    function(request,response)
    {
        // require body-parser from express, see top of this file
        console.log(request.body.title)// these are the form inputs
        console.log(request.body.uri)
        console.log(request.body.master_id)
        DB.query('INSERT INTO track (playlist_id,title, uri, master_id) VALUES ($1, $2, $3, $4)',
        [request.body.playlist_id, request.body.title, request.body.uri, request.body.master_id],
            function(results){
                var html_str = JSON.stringify(results.rows)
                console.log(html_str)
                response.send(html_str)
            }
        )
        response.send("this is the POST reply122")
    }
)

// START SERVER -----------------------------------
app.listen(3030,function(){
    console.log("User autentication service is running")
})