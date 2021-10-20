using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace CleanArchitecture.Persistence.Migrations
{
    public partial class SubMerchant : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "SubMerchants",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false),
                    UserId = table.Column<string>(nullable: true),
                    SubMerchantKey = table.Column<string>(nullable: true),
                    MerchantType = table.Column<int>(nullable: false),
                    Address = table.Column<string>(nullable: true),
                    TaxOffice = table.Column<string>(nullable: true),
                    TaxNumber = table.Column<string>(nullable: true),
                    ContactName = table.Column<string>(nullable: true),
                    ContactSurname = table.Column<string>(nullable: true),
                    LegalCompanyTitle = table.Column<string>(nullable: true),
                    Email = table.Column<string>(nullable: true),
                    GsmNumber = table.Column<string>(nullable: true),
                    Name = table.Column<string>(nullable: true),
                    Iban = table.Column<string>(nullable: true),
                    IdentityNumber = table.Column<string>(nullable: true),
                    Currency = table.Column<string>(nullable: true),
                    ApplicationDate = table.Column<DateTime>(nullable: false),
                    LastEditDate = table.Column<DateTime>(nullable: true),
                    HasSignedContract = table.Column<bool>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SubMerchants", x => x.Id);
                    table.ForeignKey(
                        name: "FK_SubMerchants_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_SubMerchants_SubMerchantKey",
                table: "SubMerchants",
                column: "SubMerchantKey",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_SubMerchants_UserId",
                table: "SubMerchants",
                column: "UserId",
                unique: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "SubMerchants");
        }
    }
}
