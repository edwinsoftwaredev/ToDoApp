using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Todo_App.Migrations
{
    public partial class AddTodoModel : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Discriminator",
                table: "User",
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateTable(
                name: "Todo",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CreateById = table.Column<string>(nullable: true),
                    Title = table.Column<string>(nullable: true),
                    Description = table.Column<string>(nullable: true),
                    IsFetured = table.Column<bool>(nullable: false),
                    EndDate = table.Column<DateTime>(nullable: false),
                    Cheked = table.Column<bool>(nullable: false),
                    UserTodoId = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Todo", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Todo_User_CreateById",
                        column: x => x.CreateById,
                        principalTable: "User",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Todo_User_UserTodoId",
                        column: x => x.UserTodoId,
                        principalTable: "User",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Todo_CreateById",
                table: "Todo",
                column: "CreateById");

            migrationBuilder.CreateIndex(
                name: "IX_Todo_UserTodoId",
                table: "Todo",
                column: "UserTodoId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Todo");

            migrationBuilder.DropColumn(
                name: "Discriminator",
                table: "User");
        }
    }
}
