import { Component, OnInit } from '@angular/core';
import { Feedback } from 'src/app/models/data-types';
import { User } from 'src/app/models/user';
import { FeedbackService } from 'src/app/services/feedback.service';
import { UserAuthService } from 'src/app/services/user-auth.service';

@Component({
  selector: 'app-feedbacks',
  templateUrl: './feedbacks.component.html',
  styleUrls: ['./feedbacks.component.css']
})
export class FeedbacksComponent implements OnInit {

  feedbacks: Feedback[] = [];
  user: User

  constructor(private feedbackSrv: FeedbackService, private userSrv: UserAuthService) { }

  async ngOnInit(): Promise<void> {
    this.user = this.userSrv.GetLocalUser()!;
    this.feedbacks = await this.feedbackSrv.getFeedbackByUserId(this.user._id!);
  }

}
