FROM node:12-alpine as ui-build
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
COPY ClientApp/package.json ./
COPY ClientApp/package-lock.json ./
RUN npm ci --silent
COPY ClientApp/ ./
RUN npm run build

FROM mcr.microsoft.com/dotnet/core/sdk:3.1 AS build-env
WORKDIR /app
COPY *.csproj ./
RUN dotnet restore
# Copy everything else and build
COPY --from=ui-build /app/build/static ./ClientApp/build
COPY . ./
RUN dotnet publish -c Release -o out

# Build runtime image
FROM mcr.microsoft.com/dotnet/core/aspnet:3.1
WORKDIR /app
COPY --from=build-env /app/out .
EXPOSE 5000
ENTRYPOINT ["dotnet", "Todo-App.dll"]