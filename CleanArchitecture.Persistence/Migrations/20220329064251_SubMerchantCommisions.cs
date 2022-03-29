using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace CleanArchitecture.Persistence.Migrations
{
    public partial class SubMerchantCommisions : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "CommissionStatusId",
                table: "SubMerchants",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "CommissionStatuses",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false),
                    Name = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CommissionStatuses", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_SubMerchants_CommissionStatusId",
                table: "SubMerchants",
                column: "CommissionStatusId");

            migrationBuilder.AddForeignKey(
                name: "FK_SubMerchants_CommissionStatuses_CommissionStatusId",
                table: "SubMerchants",
                column: "CommissionStatusId",
                principalTable: "CommissionStatuses",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_SubMerchants_CommissionStatuses_CommissionStatusId",
                table: "SubMerchants");

            migrationBuilder.DropTable(
                name: "CommissionStatuses");

            migrationBuilder.DropIndex(
                name: "IX_SubMerchants_CommissionStatusId",
                table: "SubMerchants");

            migrationBuilder.DropColumn(
                name: "CommissionStatusId",
                table: "SubMerchants");
        }
    }
}
