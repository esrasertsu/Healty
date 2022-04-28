using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace CleanArchitecture.Persistence.Migrations
{
    public partial class ProfileCommentReports : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ReportDate",
                table: "UserProfileComments");

            migrationBuilder.DropColumn(
                name: "ReportedBy",
                table: "UserProfileComments");

            migrationBuilder.CreateTable(
                name: "ProfileCommentReports",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false),
                    UserProfileCommentId = table.Column<Guid>(nullable: false),
                    Body = table.Column<string>(nullable: true),
                    ReportedBy = table.Column<string>(nullable: true),
                    CreatedAt = table.Column<DateTime>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProfileCommentReports", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ProfileCommentReports_UserProfileComments_UserProfileComment~",
                        column: x => x.UserProfileCommentId,
                        principalTable: "UserProfileComments",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ProfileCommentReports_UserProfileCommentId",
                table: "ProfileCommentReports",
                column: "UserProfileCommentId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ProfileCommentReports");

            migrationBuilder.AddColumn<DateTime>(
                name: "ReportDate",
                table: "UserProfileComments",
                type: "datetime(6)",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<string>(
                name: "ReportedBy",
                table: "UserProfileComments",
                type: "longtext CHARACTER SET utf8mb4",
                nullable: true);
        }
    }
}
