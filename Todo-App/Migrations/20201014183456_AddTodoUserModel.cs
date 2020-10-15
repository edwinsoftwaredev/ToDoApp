using Microsoft.EntityFrameworkCore.Migrations;

namespace Todo_App.Migrations
{
    public partial class AddTodoUserModel : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Todo_User_CreateById",
                table: "Todo");

            migrationBuilder.DropForeignKey(
                name: "FK_Todo_User_UserTodoId",
                table: "Todo");

            migrationBuilder.DropIndex(
                name: "IX_Todo_UserTodoId",
                table: "Todo");

            migrationBuilder.DropColumn(
                name: "Discriminator",
                table: "User");

            migrationBuilder.DropColumn(
                name: "UserTodoId",
                table: "Todo");

            migrationBuilder.CreateTable(
                name: "TodoUser",
                columns: table => new
                {
                    UserId = table.Column<string>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TodoUser", x => x.UserId);
                    table.ForeignKey(
                        name: "FK_TodoUser_User_UserId",
                        column: x => x.UserId,
                        principalTable: "User",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.AddForeignKey(
                name: "FK_Todo_TodoUser_CreateById",
                table: "Todo",
                column: "CreateById",
                principalTable: "TodoUser",
                principalColumn: "UserId",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Todo_TodoUser_CreateById",
                table: "Todo");

            migrationBuilder.DropTable(
                name: "TodoUser");

            migrationBuilder.AddColumn<string>(
                name: "Discriminator",
                table: "User",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "UserTodoId",
                table: "Todo",
                type: "nvarchar(450)",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Todo_UserTodoId",
                table: "Todo",
                column: "UserTodoId");

            migrationBuilder.AddForeignKey(
                name: "FK_Todo_User_CreateById",
                table: "Todo",
                column: "CreateById",
                principalTable: "User",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Todo_User_UserTodoId",
                table: "Todo",
                column: "UserTodoId",
                principalTable: "User",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
