import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Feedback, Order } from 'src/app/models/data-types';
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
  isVisible = false;
  tooltips = ['Quá tệ', 'Dở', 'Bình thường', 'Tốt', 'Tuyệt vời'];
  feedbackId = '';
  score = 3;
  comment = '';

  constructor(private feedbackSrv: FeedbackService, private userSrv: UserAuthService, private toastr: ToastrService) { }

  async ngOnInit(): Promise<void> {
    this.user = this.userSrv.GetLocalUser()!;
    let result = await this.feedbackSrv.getFeedbackByUserId(this.user._id!);

    if (result && result.EC === 0) {
      this.feedbacks = result.data;
    }
  }

  showModal(feedback: Feedback): void {
    this.feedbackId = feedback._id!;
    this.score = feedback.score;
    this.comment = feedback.note
    this.isVisible = true;
  }

  onUpdated = async () => {
    const data = {
      _id: this.feedbackId,
      score: this.score,
      note: this.comment
    }

    const isUpdated = await this.feedbackSrv.updateFeedback(data);

    if (isUpdated) {
      let result = await this.feedbackSrv.getFeedbackByUserId(this.user._id!);

      if (result && result.EC === 0) {
        this.feedbacks = result.data;
        this.isVisible = false;
        this.toastr.success('Sửa đánh giá thành công');
      }
    } else {
      this.toastr.error('Sửa đánh giá thất bại');
    }
  }

}
