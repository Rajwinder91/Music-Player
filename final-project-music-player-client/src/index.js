import React from 'react';
import ReactDOM from 'react-dom';
import './css/main.css';
import './vendor/bootstrap/css/bootstrap.min.css';
const axios     = require('axios');
var Discogs     = require('disconnect').Client;

//Doscogs API Credentials
const API_TOKEN  = "XqlZmzNSfaouuXZkCazHxUXPhECkxmamqfeRmuln"
const API_URL    = 'https://api.discogs.com/database/search'

var db = new Discogs().database();
db.getRelease(176126, function(err, data){
    //console.log(data);
});

//Class Search
class Search extends React.Component {
    state = {
        title     : '',
        selectVal : '7',
        results   : [],
        playlist  : []
    }

    //Get all Playlist from DB to display the dropdown
    getPlaylist = () => {
        axios.get('http://localhost:3030/playlists')
        .then(({ data }) => {
            //console.log(data);
            this.setState({
                playlist: data
            })
          })
    }

    //Get results from discogs
    getInfo = () => {
        axios.get(`${API_URL}?q=${this.state.title}&token=${API_TOKEN}&per_page=20`)
        .then(({ data }) => {
            //console.log(data.results);
            this.setState({
                results: data.results
            })
          })
    }

    //Handle inputs
    handleInputChange = () => {
        this.setState({
            title       : this.search.value,
            selectVal   : this.playlist.value
        }, () => {
            if (this.state.title && this.state.title.length > 1) {
                if (this.state.title.length % 2 === 0) {
                this.getInfo()
                }
            }else if (!this.state.title) {
            }
        })
    }

    //Insert api data into the track database table
    insertTrack(playlistId,title,uri,masterId){
        var successRes = document.getElementById('success');
        var errorRes   = document.getElementById('error');
        successRes.innerHTML = '';
        errorRes.innerHTML   = '';
        const track = {
            playlist_id:playlistId,
            title: title,
            uri: uri,
            master_id: masterId
        }
        axios.post('http://localhost:3030/tracks', track)
        .then(response => {
            successRes.style.display = "block";
            successRes.innerHTML = "Data inserted Successfully!";
        })
        .catch(function (error) {
            errorRes.style.display  = "block";
            errorRes.innerHTML   = error;
        });
    }

    render() {
        return (
            <div class="container static">
                <div class="alert alert-success" id="success" role="alert"></div>
                <div class="alert alert-danger" id="error" role="alert"></div>
                <div>
                    <button type="button" class="btn btn-primary" onClick={this.getPlaylist}>Click to Display the List</button><br/><br/>
                    <label>Select the playlist</label> &nbsp;
                    <select ref={input => this.playlist = input} onClick={this.handleInputChange}>
                        <option value="0">Select the playlist</option>
                        {this.state.playlist.map((playst) => <option value={playst.id}>{playst.title}</option>)}
                    </select>
                </div>
                <form class="form-inline mr-auto">
                    <input class="form-control form-control-sm ml-3 w-75"  placeholder="Search for..." ref={input => this.search = input}/> &nbsp; &nbsp;
                    <button type="button" class="btn btn-info" onClick={this.handleInputChange}>Search</button>
                </form>
                <div class="limiter">
                    <div class="container-table100">
                        <div class="wrap-table100">
                            <div class="table100">
                                <table>
                                    <thead>
                                        <tr class="table100-head">
                                            <th class="column1">Track Thumb</th>
                                            <th class="column2">Title</th>
                                            <th class="column3">Master Id</th>
                                            <th class="column4">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.state.results.map((track) =>
                                            <tr>
                                                <td class="column1"><img class="thumb-img" alt="track-thumb-img" src={track.thumb}/></td>
                                                <td class="column2">{track.title}</td>
                                                <td class="column3">{track.id}</td>
                                                <td class="column4">
                                                    <button type="button" onClick={(event) => this.insertTrack(this.state.selectVal,track.title,track.uri,track.id)}> Add </button>
                                                    | <a href={"https://www.discogs.com/"+track.uri}> Redirect</a>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
ReactDOM.render(<Search />, document.getElementById('root'));
export default Search