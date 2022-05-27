using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace CleanArchitecture.Persistence.Migrations
{
    public partial class ActivityOnlineInfo : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Activities_ActivityJoinDetails_ActivityJoinDetailsId",
                table: "Activities");

            migrationBuilder.DropIndex(
                name: "IX_Activities_ActivityJoinDetailsId",
                table: "Activities");

            migrationBuilder.DropColumn(
                name: "ActivityUrl",
                table: "ActivityJoinDetails");

            migrationBuilder.DropColumn(
                name: "MeetingId",
                table: "ActivityJoinDetails");

            migrationBuilder.DropColumn(
                name: "MeetingPsw",
                table: "ActivityJoinDetails");

            migrationBuilder.DropColumn(
                name: "Zoom",
                table: "ActivityJoinDetails");

            migrationBuilder.DropColumn(
                name: "ActivityJoinDetailsId",
                table: "Activities");

            migrationBuilder.DropColumn(
                name: "CallRoomId",
                table: "Activities");

            migrationBuilder.AddColumn<Guid>(
                name: "ActivityId",
                table: "ActivityJoinDetails",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddColumn<string>(
                name: "ChannelName",
                table: "ActivityJoinDetails",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "HostUrl",
                table: "ActivityJoinDetails",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "LastUpdateDate",
                table: "ActivityJoinDetails",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<string>(
                name: "ViewUrl",
                table: "ActivityJoinDetails",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_ActivityJoinDetails_ActivityId",
                table: "ActivityJoinDetails",
                column: "ActivityId",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_ActivityJoinDetails_Activities_ActivityId",
                table: "ActivityJoinDetails",
                column: "ActivityId",
                principalTable: "Activities",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ActivityJoinDetails_Activities_ActivityId",
                table: "ActivityJoinDetails");

            migrationBuilder.DropIndex(
                name: "IX_ActivityJoinDetails_ActivityId",
                table: "ActivityJoinDetails");

            migrationBuilder.DropColumn(
                name: "ActivityId",
                table: "ActivityJoinDetails");

            migrationBuilder.DropColumn(
                name: "ChannelName",
                table: "ActivityJoinDetails");

            migrationBuilder.DropColumn(
                name: "HostUrl",
                table: "ActivityJoinDetails");

            migrationBuilder.DropColumn(
                name: "LastUpdateDate",
                table: "ActivityJoinDetails");

            migrationBuilder.DropColumn(
                name: "ViewUrl",
                table: "ActivityJoinDetails");

            migrationBuilder.AddColumn<string>(
                name: "ActivityUrl",
                table: "ActivityJoinDetails",
                type: "longtext CHARACTER SET utf8mb4",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "MeetingId",
                table: "ActivityJoinDetails",
                type: "longtext CHARACTER SET utf8mb4",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "MeetingPsw",
                table: "ActivityJoinDetails",
                type: "longtext CHARACTER SET utf8mb4",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "Zoom",
                table: "ActivityJoinDetails",
                type: "tinyint(1)",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<Guid>(
                name: "ActivityJoinDetailsId",
                table: "Activities",
                type: "char(36)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "CallRoomId",
                table: "Activities",
                type: "longtext CHARACTER SET utf8mb4",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Activities_ActivityJoinDetailsId",
                table: "Activities",
                column: "ActivityJoinDetailsId");

            migrationBuilder.AddForeignKey(
                name: "FK_Activities_ActivityJoinDetails_ActivityJoinDetailsId",
                table: "Activities",
                column: "ActivityJoinDetailsId",
                principalTable: "ActivityJoinDetails",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
