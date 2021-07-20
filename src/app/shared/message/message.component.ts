import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent implements OnInit {


  @Input('messageContent') messageContent = "Start by searching for a recipe or an ingredient. Have fun!";
  @Input('errorMessageContent') errorMessageContent = "No recipes found. Please try again!";

  @Input('errorMsg') errorMsg = false;
  constructor() { }


  ngOnInit(): void {

  }

}
