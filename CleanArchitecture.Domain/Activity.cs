using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace CleanArchitecture.Domain
{
    public class Activity
    {
        public Guid Id {get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public virtual ICollection<ActivityCategories> Categories { get; set; }
        public virtual ICollection<ActivitySubCategories> SubCategories { get; set; }
        public bool Online { get; set; }
        public int? AttendancyLimit { get; set; }
        public int AttendanceCount { get; set; }
        public int SavedCount { get; set; }
        public decimal? Price { get; set; }
        public int Duration { get; set; }
        public DateTime Date { get; set; }
        public DateTime EndDate { get; set; }
        public string CallRoomId { get; set; }
        public virtual City City { get; set; }
        public string Venue { get; set; }
        public string Address { get; set; }
        public virtual ActivityJoinDetails ActivityJoinDetails { get; set; }
        public virtual ICollection<ActivityLevels> Levels { get; set; }
        public virtual ICollection<UserActivity> UserActivities { get; set; }
        public virtual ICollection<UserSavedActivity> UserSavedActivities { get; set; }
        public virtual ICollection<ActivityComment> Comments { get; set; }
        public virtual ICollection<Photo> Photos { get; set; }
        public virtual ICollection<Video> Videos { get; set; }
        public DateTime CreationDate { get; set; }
        public DateTime LastUpdateDate { get; set; }
        public ActivityStatus Status { get; set; }
        public bool Is_Active { get {
                return Status != ActivityStatus.UnderReview && Status != ActivityStatus.CancelRequested && Status != ActivityStatus.PassiveByAdmin;
            }
        }
        public DateTime TrainerApprovedDate { get; set; }
        public DateTime AdminApprovedDate { get; set; }

        public virtual ICollection<ActivityReview> Reviews { get; set; }
        public int Star { get { return Convert.ToInt32(this.Reviews.Count() > 0 ? this.Reviews.Select(x => x.StarCount).Where(x => x > 0).DefaultIfEmpty().Average() : 0); } } //rating
        public int StarCount { get { return Convert.ToInt32(this.Reviews.Count() > 0 ? this.Reviews.Select(x => x.StarCount).Where(x => x > 0).DefaultIfEmpty().Count() : 0); } } //total rate votes ( bigger than zero) 

    }


    public enum ActivityStatus
    {
        UnderReview = 100, //listelenmeyecek X
        Active = 110, //sadece aktifse ödeme alınacak..
        TrainerCompleteApproved = 111, 
        AdminPaymentApproved = 112, 
        CancelRequested = 120, //listelenmeyecek X
        PassiveByAdmin = 130 //listelenmeyecek X
    }
}