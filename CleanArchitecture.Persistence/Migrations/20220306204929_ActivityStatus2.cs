using Microsoft.EntityFrameworkCore.Migrations;

namespace CleanArchitecture.Persistence.Migrations
{
    public partial class ActivityStatus2 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AdminApproved",
                table: "Activities");

            migrationBuilder.DropColumn(
                name: "TrainerApproved",
                table: "Activities");

            migrationBuilder.AlterColumn<int>(
                name: "Status",
                table: "Activities",
                nullable: false,
                oldClrType: typeof(bool),
                oldType: "tinyint(1)");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<bool>(
                name: "Status",
                table: "Activities",
                type: "tinyint(1)",
                nullable: false,
                oldClrType: typeof(int));

            migrationBuilder.AddColumn<bool>(
                name: "AdminApproved",
                table: "Activities",
                type: "tinyint(1)",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "TrainerApproved",
                table: "Activities",
                type: "tinyint(1)",
                nullable: false,
                defaultValue: false);
        }
    }
}
