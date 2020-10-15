using Microsoft.EntityFrameworkCore.Migrations;

namespace Todo_App.Migrations
{
    public partial class RemoveTodoUserModel : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Todo_TodoUser_CreateById",
                table: "Todo");

            migrationBuilder.DropForeignKey(
                name: "FK_TodoUser_User_UserId",
                table: "TodoUser");

            migrationBuilder.DropIndex(
                name: "IX_Todo_CreateById",
                table: "Todo");

            migrationBuilder.DropColumn(
                name: "CreateById",
                table: "Todo");

            migrationBuilder.AddColumn<string>(
                name: "UserName",
                table: "TodoUser",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "CreatedById",
                table: "Todo",
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateIndex(
                name: "IX_Todo_CreatedById",
                table: "Todo",
                column: "CreatedById");

            migrationBuilder.AddForeignKey(
                name: "FK_Todo_TodoUser_CreatedById",
                table: "Todo",
                column: "CreatedById",
                principalTable: "TodoUser",
                principalColumn: "UserId",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Todo_TodoUser_CreatedById",
                table: "Todo");

            migrationBuilder.DropIndex(
                name: "IX_Todo_CreatedById",
                table: "Todo");

            migrationBuilder.DropColumn(
                name: "UserName",
                table: "TodoUser");

            migrationBuilder.DropColumn(
                name: "CreatedById",
                table: "Todo");

            migrationBuilder.AddColumn<string>(
                name: "CreateById",
                table: "Todo",
                type: "nvarchar(450)",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Todo_CreateById",
                table: "Todo",
                column: "CreateById");

            migrationBuilder.AddForeignKey(
                name: "FK_Todo_TodoUser_CreateById",
                table: "Todo",
                column: "CreateById",
                principalTable: "TodoUser",
                principalColumn: "UserId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_TodoUser_User_UserId",
                table: "TodoUser",
                column: "UserId",
                principalTable: "User",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
